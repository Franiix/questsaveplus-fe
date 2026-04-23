const revealNodes = document.querySelectorAll('[data-reveal]');
const releaseVersionNode = document.querySelector('[data-release-version]');

async function hydrateReleaseVersion() {
 if (!releaseVersionNode) return;

 try {
  const response = await fetch('./update-manifest.json', { cache: 'no-store' });
  if (!response.ok) return;

  const manifest = await response.json();
  if (typeof manifest.latestVersion !== 'string' || manifest.latestVersion.trim().length === 0) {
   return;
  }

  releaseVersionNode.textContent = manifest.latestVersion.trim();
 } catch {
  // Keep the static fallback when the page is opened offline or via file://.
 }
}

const observer = new IntersectionObserver(
 (entries) => {
  entries.forEach((entry) => {
   if (!entry.isIntersecting) return;
   entry.target.classList.add('is-visible');
   observer.unobserve(entry.target);
  });
 },
 {
  rootMargin: '0px 0px -12% 0px',
  threshold: 0.14,
 },
);

revealNodes.forEach((node) => observer.observe(node));
hydrateReleaseVersion();

import type { ProfileEntity } from '../entities/Profile.entity';

export interface ProfileModel extends ProfileEntity {
 age: number | null;
 full_name: string;
}

export function toProfileModel(entity: ProfileEntity): ProfileModel {
 return {
  ...entity,
  full_name: `${entity.first_name} ${entity.last_name}`,
  age: entity.birth_date ? calculateAge(entity.birth_date) : null,
 };
}

function calculateAge(birthDate: string): number {
 const today = new Date();
 const birth = new Date(birthDate);
 let age = today.getFullYear() - birth.getFullYear();
 const monthDiff = today.getMonth() - birth.getMonth();
 if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
  age--;
 }
 return age;
}

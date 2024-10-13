export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  phoneCountryCode: number;
  email: string;
}

export function userDetailsMapper(user: any): UserDetails {
  return {
    id: user.id || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phoneNumber: user.phoneNumber || 0,
    phoneCountryCode: user.phoneCountryCode || 0,
    email: user.email || '',
  };
}
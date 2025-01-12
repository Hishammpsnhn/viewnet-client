export const useTenantLoginValidator = ({
 
  username,
  phone,
}: {
  username?: string;
  phone?: string;
}) => {


  // Username validation
  if (username && username.trim().length <= 3)
    return "Please provide a valid company name";

  // Phone validation
  if(phone?.length == 0) return "Please provide a phone number"
  if (phone && phone.trim().length < 10) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) return "Please provide a valid phone number";
    if (!phoneRegex.test(phone))
      return "Please provide a valid phone number with 10 digits";
  }

  return null; // Return null if all validations pass
};
export const useLoginValidator = ({ email }: { email?: string }) => {
   (`useLoginValidator`, email?.length);
  if(email?.length == 0) return "Please provide a valid email format"
  if (email) {
     ("emial")
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.trim().length < 5)
      return "Please provide a valid email format";
  }

  return null; 
};

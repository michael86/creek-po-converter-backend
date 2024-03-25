export const generateToken = () => {
  let letters = `abcdefghijklmnopqrstuvwxyzABCDEFGHIHJKLMNOPQRSTUVWXYZ1234567890`;

  let token = "";
  for (let i = 0; i <= 32; i++) {
    token += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  return (token += Date.now());
};

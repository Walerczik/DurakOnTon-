// Для корректного импорта PNG в TypeScript
declare module "*.png" {
  const value: string;
  export default value;
}
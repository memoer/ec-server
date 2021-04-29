type Area = 'Decorator' | 'Filter' | 'Guard' | 'Interceptor' | 'Servie';
interface GetExceptionMsg {
  area?: Area;
  name: string;
  msg: string;
}
export default ({ area, name, msg }: GetExceptionMsg) => {
  if (!area) return `[${name}]\t${msg}`;
  return `[${name}_${area}]\t${msg}`;
};

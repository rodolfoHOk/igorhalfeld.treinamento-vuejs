import { readonly } from 'vue';
import GlobalModule from './global';
import UserModule from './user';

export default readonly({
  Global: GlobalModule,
  User: UserModule,
});

import Cookies from 'js-cookie';
import store from '@src/store';
import ajax from '@utils/config';
export default function loginout(isLoginout, that) {
    if (isLoginout) {
        ajax({
            url: 'auth/logout',
            optionParams: {}
        }).post()
            .then(res => {
                if (res.code === 200) {
                    that.$message.success(res.message);
                } else {
                    // that.$message.warning(res.message);
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
    // token
    store.dispatch('SETUSER', { user: '' });
    store.dispatch('SETTOKEN', { token: '' });
    Cookies.remove('user');
    //Cookies.remove('token');
     window.location.reload();
}
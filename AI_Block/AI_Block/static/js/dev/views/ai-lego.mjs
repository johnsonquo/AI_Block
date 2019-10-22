import {store} from '../store/store.mjs';

import {singUp} from '../components/singup/singup.mjs';
import {Login} from '../components/login/login.mjs';

import {legoHeader} from '../components/lego-header/lego-header.mjs';

new Vue({
    el: '#app',
    components: {
        singUp,
        Login,
        legoHeader
    },
    computed: {
        showSingUP () {
            return store.state.showSingUP;
        },
        showLogin () {
            return store.state.showLogin;
        }
    }
})
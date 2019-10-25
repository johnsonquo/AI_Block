import {store} from '../store/store.mjs';

import {singUp} from '../components/singup/singup.mjs';
import {Login} from '../components/login/login.mjs';

import {legoHeader} from '../components/lego-header/lego-header.mjs';

new Vue({
    el: '#app',
    delimiters: ['#{', '}'],
    components: {
        singUp,
        Login,
        legoHeader
    },
    methods: {
        login () {
            this.$refs.login.show();
        }
    },
    computed: {
        showSingUP () {
            return store.state.showSingUP;
        },
        showLogin () {
            return store.state.showLogin;
        }
    },
    mounted () {
        particlesJS.load('particles', '/static/js/particles.json', function() {});
    }
})
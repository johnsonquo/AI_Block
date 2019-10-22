import {store} from '../../store/store.mjs';

export const Login = {
    delimiters: ['#{', '}'],
    props: {
        status: false
    },
    data () {
        return {
            email: '',
            password: ''
        }
    },
    template: `
                <div class="login" v-show="status">

                    <div class="login-wrapper">

                        <i class="fas fa-times" @click="hide"></i>

                        <h3>登入</h3>
                        
                        <form @submit.prevent="login">

                            <input type="email" placeholder="電子郵件" v-model="email" required>
                            <input type="password" placeholder="密碼" v-model="password" required>

                            <button  class="btn-normal">登入</button>

                        </form>

                        <h4>未註冊帳戶? <a href="#" @click="showSingup">去註冊</a></h4>

                    </div>

                </div>
    `,
    methods: {
        login () {
            axios.get('/api/user/').then((res) => {
                console.log('res ',res)
            })
        },
        show () {
            store.state.showLogin = true;
        },
        hide () {
            this._empty();
            store.state.showLogin = false;
        },
        showSingup () {
            this.hide();
            store.state.showSingUP = true;
        },
        _empty () {
            this.email = '';
            this.password = '';
        }
    }
}
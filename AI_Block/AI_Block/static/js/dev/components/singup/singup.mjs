import {store} from '../../store/store.mjs';

export const singUp = {
    delimiters: ['#{', '}'],
    props: {
        status: false
    },
    data () {
        return {
            email: '',
            password: '',
            confirmPassword: '',
            username: '',
            errorMsg: ''
        }
    },
    template: `
                <div class="singup" v-show="status">

                    <div class="singup-wrapper">

                        <i class="fas fa-times" @click="hide"></i>

                        <h3>註冊</h3>
                        
                        <form @submit.prevent="singUp">

                            <input type="email" placeholder="電子郵件" v-model="email" required>
                            <input type="text" placeholder="用戶名" v-model="username" required>
                            <input type="password" placeholder="密碼" v-model="password" required>
                            <input type="password" placeholder="確認密碼" v-model="confirmPassword" required>
                            <p class="error" v-show="errorMsg">#{errorMsg}</p>

                            <button  class="btn-normal">註冊</button>
                        </form>

                        <h4>已經擁有帳戶? <a href="#" @click="showLogin">登入</a></h4>

                    </div>

                </div>
    `,
    methods: {
        singUp () {

            this.errorMsg = '';

            if (this.password !== this.confirmPassword) {
                this.errorMsg = '密碼不匹配，請重新輸入';
            }
            
            // post singup api
            const data = {
                email: this.email,
                password: this.password,
                username: this.username,

            }

            axios.post('/api/user/',data).then(res => {
                console.log('res ',res)
            })

            this._empty();

        },
        showLogin () {
            this.hide();
            store.state.showLogin = true;
        },
        hide () {
            this._empty();
            store.state.showSingUP = false;
        },
        _empty () {
            this.email = '';
            this.username = '';
            this.password = '';
            this.confirmPassword = '';
        }
    }
}
import { store } from "../../store/store.mjs"


export const legoHeader = {
    delimiters: ['#{', '}'],
    props: {
        bgc: {
            type: String,
            default: "background:linear-gradient(to right, #3a5b7c, #0f2b4e"
        }
    },
    template: `
                <header class="header" :style="background">

                    <div class="header-left">
                        <h1 class="logo"><a href="/"> ForceFintech <span class="logo-sub">A.I lego</span></a></h1>
                    </div>
                    
                    <nav class="header-right">
                        <ul class="nav-box">
                            <li class="nav-item"><a href="/">首頁</a></li>
                            <li class="nav-item"><a href="/lego">A.I lego</a></li>
                            <li class="nav-item"><a href="#" @click="singup">註冊</a></li>
                            <li class="nav-item"><a href="#" @click="login" >登入</a></li>
                        </ul>
                    </nav>

                </header>
    `,
    methods: {
        singup () {
            store.state.showSingUP = true;
        },
        login () {
            store.state.showLogin = true;
        }
    },
    computed: {
        background () {
            return this.bgc;
        }
    }
}
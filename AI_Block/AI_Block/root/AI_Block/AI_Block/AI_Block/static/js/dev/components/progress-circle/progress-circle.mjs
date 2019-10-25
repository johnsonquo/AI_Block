export const progressCircle = {
    delimiters: ['#{', '}'],
    props: {
        radius: {
            type: Number,
            default: 120
        },
        percent: {
            type: Number,
            default: 0
        },
        status: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            dashArray: Math.PI * 100
        }
    },
    template: `    
                <div class="progress-circle" v-show="status">
                    <div class="circle">
                        <svg :width="radius" :height="radius" viewBox="0 0 100 100">
                            <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
                            <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
                        </svg>
                        <h4 class="circle-text">運算中...</h4>
                    </div>
                </div>`,
    computed: {
        dashOffset () {
            return (1 - this.percent) * this.dashArray;
        }
    }
}
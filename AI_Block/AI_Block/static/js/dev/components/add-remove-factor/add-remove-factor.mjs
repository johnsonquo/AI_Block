export const addRemoveFactor = {
    delimiters: ['#{', '}'],
    props: {
        index: {
            type: Number,
            default: ''
        },
        item: {
            type: Object,
            default () {
                return {}
            }
        },
        factors: {
            type: Array,
            default: []
        },
        icon: {
            type: String,
            default: 'fas fa-plus'
        }
    },
    data () {
        return {
            selectedFactor: '請選擇',
            factorParameterDay: '',
            factorParameter2: ''

        }
    },
    template: ` <tr>
                    <td @click="handleClick"><i :class="iconCls"></i></td>
                    <td>
                        <select v-model="selectedFactor" @change="handleChangeFactor">
                            <option selected>請選擇</option>
                            <option v-for="(factor,index) in factors" :value="factor" :key="index">#{factor}</option>
                        </select>
                    </td>
                    <td><input type="number" min="1" v-model="factorParameterDay" @input="handleChangeFactor"></td>
                    <td><input type="text" v-model="factorParameter2" @input="handleChangeFactor"></td>
                </tr>`,
    methods: {
        handleClick () {
            const selectFactorObj = {
                n: this.index,
                index: this.selectedFactor,
                day: this.factorParameterDay,
                parameter2: this.factorParameter2,
                uid: this.item.uid
            }
            this.$emit('handle-click-icon', selectFactorObj);
        },
        selectFactor(item,factor,index) {
            if (item.index === factor) {
                this.selectedFactor = item.index;
                this.factorParameterDay = item.day;
                this.factorParameter2 = item.parameter2;
                return item.index;
            }else {
                return factor;
            }
        },
        handleChangeFactor() {
            const selectFactorObj = {
                n: this.index,
                index: this.selectedFactor,
                day: this.factorParameterDay,
                parameter2: this.factorParameter2,
                uid: this.item.uid
            }
            this.$emit('change-factor', selectFactorObj);
        }
    },
    computed: {
        iconCls () {
            return this.icon;
        }
    }
}
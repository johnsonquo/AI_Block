import {addRemoveFactor} from '../components/add-remove-factor/add-remove-factor.mjs';
import {progressCircle} from '../components/progress-circle/progress-circle.mjs';
import {singUp} from '../components/singup/singup.mjs';
import {Login} from '../components/login/login.mjs';

import {legoHeader} from '../components/lego-header/lego-header.mjs';

import {store} from '../store/store.mjs';

new Vue({
    el: '#app',
    components: {
        legoHeader,
        addRemoveFactor,
        progressCircle,
        singUp,
        Login
    },
    data: {
        allStock: '',
        stepTitle: 'STEP1 選股票',
        ai: ['決策樹','隨機森林'],
        predictArray: ['明天報酬','下周報酬'],
        factorsArray: ['high','low','close','open','volume','ma','rsi'],
        companyName: '台泥',
        companyCode: '1101',
        selectedAi: '決策樹',
        selectedPredict: '明天報酬',
        sampleInStartDate: '2008-01-01',
        sampleInEndDate: '2013-01-01',
        sampleOutStartDate: '2013-01-02',
        sampleOutEndDate: '2018-01-01',
        factors: '',
        factorCount: [
            {
                n: 0,
                index: '',
                day: '',
                parameter2: '',
                uid: Math.random()
            }
        ],
        inLimitValue: '',
        outLimitValue: '',
        stopLossPoint: '',
        lockInGainValue: '',
        circlePercent: 0,
        loadingPercent: 0,
        PI: Math.PI * 100,
        status: false
    },
    delimiters: ['#{', '}'],
    methods: {
        async getCompany () {

            const api = await axios.get('/api/stockList/');

            this.allStock = api.data;
        },
        selectCompany (code,company) {
            this.companyCode = code;
            this.companyName = company;
        },
        selectAI (item) {
            this.selectedAi = item;
        },
        selectPredict (item) {
            this.selectedPredict = item;
        },
        nextStep (step) {
            
            const {mainLeftBoxes,mainRightBoxes} = this._changeCurrentStep()

            mainRightBoxes[step].style.display = 'flex';
            mainLeftBoxes[step].className += " step-active";
        },
        changeMainRightBox (e,currentStep,stepTitle) {

            this._changeCurrentStep();

            this.$refs[currentStep].style.display = "flex";
            e.currentTarget.className += " step-active";

            this.stepTitle = currentStep.toUpperCase() + ' ' + stepTitle;
        },
        handleClickIcon(data) {
            
            if (data.n === this.factorCount.length - 1) {

                this.factorCount[data.n] = data;

                this.factorCount.push({
                    n: data.n + 1,
                    index: '',
                    day: '',
                    parameter2: '',
                    uid: Math.random()
                });
            }else {
                this.factorCount.splice(data.n,1);
            }
        },
        handleIconText (index) {
            if (index === this.factorCount.length - 1) {
                return 'fas fa-plus'
            }else {
                return 'fas fa-minus'
            }
        },
        changeFactor(data) {
            this.factors = this.selectedFactor + ' ' + data.index;
            this.factorCount[data.n] = data;
        },
        postData () {

            this.status = true;

            const postData = {
                companyName: this.companyName,
                companyCode: this.companyCode,
                selectedAi: this.selectedAi,
                selectedPredict: this.selectedPredict,
                sampleInStartDate: this.sampleInStartDate,
                sampleInEndDate: this.sampleInEndDate,
                sampleOutStartDate: this.sampleOutStartDate,
                sampleOutEndDate: this.sampleOutEndDate,
                factor: this.factorCount,
                inLimitValue: this.inLimitValue,
                outLimitValue: this.outLimitValue,
                stopLossPoint: this.stopLossPoint,
                lockInGainValue: this.lockInGainValue
            }
            
            var percentSet = 0.8;

            const PI = Math.PI * 100;
            var timer = setInterval(loadingProcess.bind(this),100);

            
            function loadingProcess() {

                this.PI--
                this.loadingPercent = (PI - this.PI) / PI;

                if (this.loadingPercent > percentSet) {
                    
                    clearInterval(timer);
                }

            }

            axios.post(`/api/evaluate/`,postData).then((res) => {

                if (res.data) {

                    clearInterval(timer)

                    percentSet = 1;

                    timer = setInterval(loadingProcess.bind(this),10);
                    
                    const promise = new Promise((resolve,reject) => {
                        setTimeout(() => {
                            console.log('resolve')
                            resolve();
                        },5000)
                    })

                    promise.then(() => {
                        window.location.href = '/machineResult';
                    })

                }

            })

        },
        _changeCurrentStep () {

            const mainLeftBoxes  = this.$refs.mainLeftBox.children;
            const mainRightBoxes = this.$refs.mainRightBox.children;

            for (let i =0; i < mainRightBoxes.length; i++) {
                mainLeftBoxes[i].className = mainLeftBoxes[i].className.replace(" step-active", "");
                mainRightBoxes[i].style.display = 'none';
            }

            return {mainLeftBoxes,mainRightBoxes};
        },
    },
    computed: {
        selectedCompany () {
            return this.companyCode + " " + this.companyName;
        },
        selectedSampleInDate () {
            if (this.sampleInStartDate && this.sampleInEndDate) {
                return this.sampleInStartDate + " ~ " + this.sampleInEndDate;
            }
            return '';
        },
        selectedSampleOutDate () {
            if (this.sampleOutStartDate && this.sampleOutEndDate) {
                return this.sampleOutStartDate + " ~ " + this.sampleOutEndDate;
            }
            return '';
        },
        selectedFactor () {
            return this.factors;
        },
        selectedBackTesting1 () {
            if (this.inLimitValue && this.outLimitValue ) {
                return this.inLimitValue + ' , ' + this.outLimitValue;
            }
            return '';
        },
        selectedBackTesting2 () {
            if (this.stopLossPoint && this.lockInGainValue ) {
                return this.stopLossPoint + ' , ' + this.lockInGainValue;
            }
            return '';
        },
        stepCompletedProcess () {
            const completed = [];
            var step3;
            var step6;

            if (this.sampleInStartDate && this.sampleInEndDate && this.sampleOutStartDate && this.sampleOutEndDate ) {
                step3 = {
                    sampleInStartDate: this.sampleInStartDate,
                    sampleInEndDate: this.sampleInEndDate,
                    sampleOutStartDate: this.sampleOutStartDate,
                    sampleOutEndDate: this.sampleOutEndDate
                }
            }

            if (this.inLimitValue && this.outLimitValue && this.stopLossPoint, this.lockInGainValue) {
                step6 = {
                    inLimitValue: this.inLimitValue,
                    outLimitValue: this.outLimitValue,
                    stopLossPoint: this.stopLossPoint,
                    lockInGainValue: this.lockInGainValue
                }
            }

            const stepObj = {
                stepOne: this.companyName,
                steptwo: this.selectedAi,
                stepThree: step3,
                stepFour: this.selectedPredict,
                stepFive: this.factor1,
                stepSix: step6
            }

            for (let i in stepObj) {
                if (stepObj[i]) {
                    completed.push(stepObj[i])
                }
            }
            
            return completed;
        },
        showSingUP () {
            return store.state.showSingUP;
        },
        showLogin () {
            return store.state.showLogin;
        }
        
    },
    watch: {
        stepCompletedProcess (newVal) {
            if (newVal.length) {
                const bottom = -145 + (80 / 6 * newVal.length);
                this.circlePercent = Math.floor((100 / 6 * newVal.length));
                this.$refs.wave.style.bottom = bottom + '%';
            }
        },
        sampleInEndDate(newVal,oldVal) {

            if (!newVal) return;

            const splitDate = newVal.split('-');

            splitDate[1] = Number(splitDate[1]) - 1;
            splitDate[2] = Number(splitDate[2]) + 1;


            const date = new Date(splitDate[0], splitDate[1], splitDate[2]);

            const year = date.getFullYear();
            
            var month = date.getMonth() + 1;
            var day   = date.getDate();

            if (month < 10) {
                month = '0' + month;
            }

            if (day < 10) {
                day = '0' + day;
            }

            this.sampleOutStartDate = year + '-' + month + '-' + day;
        }
    },
    mounted () {
        this.getCompany();
        this.$refs.mainRightBox.children[0].style.display = 'flex';
    }
})
Vue.component('modal', {
  template: `<div class="modal" :class="type">
              <div class="modal-background"></div>
              <div class="modal-card">
                <header class="modal-card-head">
                  <p class="modal-card-title">
                    <slot name="title"></slot>
                  </p>
                </header>
                <section class="modal-card-body">
                  <slot name="body"></slot>
                </section>
                <footer class="modal-card-foot">
                  <slot name="footer"></slot>                  
                </footer>
              </div>
             </div>`,
  props: {
    type: String,
  },
})

Vue.component('v-button', {
  template: `<button class="button" :class="type" @click="callback($event)">
                <slot></slot>
             </button>`,
  props: {
    type: String,
  },
  methods: {
    callback(e) {
      this.$emit('click', e);
    },
    
  }
})

Vue.component('v-select', {
  template: `<select class="form-control" @change="update">
                 <option v-for="(val,text) in options.items":value="val">{{text}}</option>
             </select>`,
  props: ['options'],
  methods:{
    update(event) {
      this.$emit("change", event.target.value)
    }
  }
})
var app = new Vue({
  el: '#app',
  data: {
    text: 'easy',
    time: '60',
    test : {
      'easy' : 'A cupcake is a small cake designed to serve one person, which may be baked in a small thin paper or aluminium cup. As with larger cakes, icing and other cake decorations, such as sprinkles, may be applied. A standard cupcake uses the same basic ingredients as standard-sized cakes: butter, sugar, eggs, and flour. Nearly any recipe that is suitable for a layer cake can be used to bake cupcakes. The cake batter used for cupcakes may be flavored or have other ingredients stirred in, such as raisins, berries, nuts, or chocolate chips. Because their small size is more efficient for heat conduction, cupcakes bake much faster than a normal layered cake. Cupcakes are sometimes used to celebrate and illustrate specific events. ',
      'hard' : 'The Super Bowl is the annual championship game of the National Football League (NFL), the highest level of professional American football in the United States, culminating a season that begins in the late summer of the previous calendar year. The Super Bowl uses Roman numerals to identify each game, rather than the year in which it is held. For example, Super Bowl I was played on January 15, 1967, following the 1966 regular season. The game was created as part of a merger agreement between the NFL and its then-rival league, the American Football League (AFL). It was agreed that the two leagues\' champion teams would play in the AFL-NFL World Championship Game until the merger was to officially begin in 1970.',
      'lorem' : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae fuga facere, quidem error. Commodi saepe quas est magni fugit corporis quam, quaerat, neque officiis vel vitae optio maxime! Voluptas, architecto.'
    },
    timer: null,
    userInput: document.querySelector('.input').innerText,
    compareInt: 0,
    ogTime: 0,
    wpm: 0,
    errors: 0,
    timeList: {
        items: {'1 minute' : '60', '2 minute' :'120', '3 minute' :'180'}
    },
    textList: {
        items: {'Esay' : 'esay', 'Hard' : 'hard', 'Lorem' : 'lorem'}
    },
    name: '',
    savedScores: null,
  },
  methods: {
    //select text for test
    updateText(x) {
      this.text = x
    },
    //select time for test
    updateTime(x) {
      this.time = x
    },
    //add 0 to time if needed
    padTime(time) {
      return (time < 10 ? '0' : '') + time;
    },
    //start timer, save total test time
    startTimer() {
      this.ogTime = this.time
      this.timer = setInterval(() => parseInt(this.countdown()), 1000)
    },
    //decrement timer, end test when timer is 0
    countdown() {
      if (this.time >= 1) {
        this.time--;
      } else {
        this.time = 0;
        clearInterval(this.timer);
        this.timer = null;
        this.endTest()
      }
    },
    //compare typed text with original text
    compareText() {
      //make the word bold as user types 
      this.wordArray[this.compareInt] = `<b>${this.wordArray[this.compareInt]}</b>`
      //update html
      this.wordsToType.innerHTML = this.wordArray.join(' ')
      //get user typed words for testing
      let typed = document.querySelector('#app > div.input > textarea').value.split(' ').filter(x => x.length > 0)
      //test words per minute 
      if (this.ogTime == '60')
        this.wpm = typed.length
      if (this.ogTime == '120')
        this.wpm = typed.length / 2
      if (this.ogTime == '180')
        this.wpm = typed.length / 3
      //test for accuracy 
      if (typed[this.compareInt] != this.test[this.text].split(' ')[this.compareInt]) 
        this.errors++
      //stop if test if user typed all words
      if (this.compareInt == this.numWords || this.time === 0) {
        this.endTest()
        return
      }
      //move to next word 
      this.compareInt++
    },
    closeModal() {
      document.querySelector('#start-modal').classList.remove('is-active')
    },
    endTest() {
      document.querySelector('#end-modal').classList.add('is-active')

      if (document.querySelector('#score-modal').classList.contains('is-active'))
        document.querySelector('#score-modal').classList.remove('is-active')
    },
    getScores() {
      axios.get('scripts/php/get.php')
      .then(response => {        
        this.savedScores = response.data
        console.log(response.data)
        console.log(this.savedScores)
      })
      .catch(error =>{
        console.log(error)
      })

      document.querySelector('#score-modal').classList.add('is-active')
      document.querySelector('#end-modal').classList.remove('is-active')
    },
    setScore() {
      axios.post('scripts/php/set.php', {
        name: this.name,
        speed: this.wpm,
        accuracy: document.querySelector('#end-modal > div.modal-card > section > div > p:nth-child(2) > span').innerText
      })
      .then(response => {
        console.log(response)
      })
      .catch(error =>{
        console.log(error)
      })
    },
    reload() {
      window.location.reload()
    }
  },
  computed: {
    minutes() {
      const minutes = Math.floor(this.time / 60)
      return minutes
    },
    seconds() {
      const seconds = this.time - (this.minutes * 60);
      return this.padTime(seconds);
    },
    wordArray() {
      return this.test[this.text].split(' ')
    },
    numWords() {
      return this.wordArray.length
    },
    wordsToType() {
      return document.querySelector('#app > div.test > p')
    },
  }, 
  watch: {
  },
})
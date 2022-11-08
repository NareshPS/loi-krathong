import 'core-js/stable'
import 'regenerator-runtime/runtime' // Enable Vue Async/Await constructs
import {default as axios} from 'axios'
import * as Papa from 'papaparse'
import {createApp} from 'vue'

const app = createApp({
  data() {
    return {
      currentItem: {word: '', details: ''},
      vocab: {data: [], columns: []},
      errorMessage: ''
    }
  },
  methods: {
    clearError() {
      this.errorMessage = ''
    },

    async loadVocab(complete_fn) {
      try {
        const response = await axios.get('/vocab.csv', { responseType: 'blob' })
        const file = response.data
        Papa.parse(file, {
          header: true,
          complete: complete_fn
        })
      }
      catch (err) {
        this.errorMessage = err.toString()
        console.error(this.errorMessage)
      }
    },

    nextWord() {
      const randomIdx = Math.floor(Math.random()*this.vocab.data.length)
      const chosenItem = this.vocab.data[randomIdx]
      // const [wordLabel, descLabel] = this.vocab.columns.slice(0, 2)
      const word = chosenItem[this.vocab.columns[0]]
      this.currentItem = {
        word: word,
        details: chosenItem 
      }

      this.$refs.searchVisualCues.click()
    },
  },

  computed: {
    itemDetails() {
      return Object.fromEntries(
        Object.entries(this.currentItem.details)
        .slice(1)
        .filter(([key, value]) => value)
      )
    }
  },

  mounted: async function() {
    this.clearError()
    this.loadVocab((results) => {
      this.vocab = {
        data: results.data,
        columns: results.meta.fields
      }
      this.nextWord()
    })
  }
})

app.mount('#app')
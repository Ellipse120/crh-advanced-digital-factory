<template>
  <div>
    <div class="grid grid-cols-2 text-center bg-red-500 text-white text-xl divide-x divide-white">
      <div>x: {{ x }}</div>
      <div>y: {{ y }}</div>
    </div>

    <el-divider>GSAP Animation</el-divider>

    <div ref="wordsRef" class="border-4 border-dashed rounded-3xl border-purple-700 my-2 p-4">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum cupiditate dolor dolores eligendi in, laborum pariatur quae repellat totam. Dolores error, esse illo in labore maiores obcaecati odit reprehenderit tempora
    </div>

    <div id="demo" ref="machineGunRef" class="bg-black m-auto overflow-hidden relative h-96" />

  </div>
</template>

<script>
import { useMouse } from '@vueuse/core'
import { onMounted, ref } from '@vue/composition-api'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(TextPlugin)

export default {
  name: 'Demo',
  setup () {
    const { x, y } = useMouse()
    const wordsRef = ref(null)
    const machineGunRef = ref(null)

    const _sentenceEndExp = /(\.|\?|!)$/g
    const tl = gsap.timeline({
      delay: 0.6,
      repeat: 2,
      repeatDelay: 4
    })

    const machineGun = () => {
      let word
      let isSentenceEnd
      let duration
      let time = 0
      const wordArr = wordsRef.value.textContent.split(' ').filter(o => o)

      for (let i = 0; i < wordArr.length; i++) {
        word = wordArr[i]
        isSentenceEnd = _sentenceEndExp.test(word)
        duration = Math.max(0.5, word.length * 0.08)

        if (isSentenceEnd) {
          duration += 0.6
        }

        const tmp = document.createElement('h3')
        tmp.innerText = word
        tmp.style = `
          position: absolute;
          margin: 0 auto;
          width: 100vw;
          text-align: center;
          font-size: 120px;
          opacity: 0;
          font-weight: bolder;
          color: red;
          top: 65px;
        `

        machineGunRef.value.append(tmp)

        gsap.set(tmp, { autoAlpha: 0, scale: 0, z: 0.01 })
        tl.to(tmp, { scale: 1.2, duration, ease: 'slow(0.25, 0.9)' }, `${time} - 0.2`)
          .to(tmp, { autoAlpha: 1, duration, ease: 'slow(0.25, 0.9, true)' }, time)
          .to(tmp, { autoAlpha: 0, duration, ease: 'slow(0.25, 0.7)' })

        time += duration - 0.05
        if (isSentenceEnd) {
          time += 0.6
        }
      }
    }

    onMounted(() => {
      machineGun()
    })

    return {
      x,
      y,
      wordsRef,
      machineGunRef
    }
  }
}
</script>

<style scoped>

</style>

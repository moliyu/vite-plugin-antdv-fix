# vite-plugin-antdv-fix

## why

ant-design-vue@1.7.8不在维护,基于现在vue2 + vite + antdv已存在问题

+ 生产环境require is not defined
+ moment.isMoment is not export by default

## use

```shell
yarn add vite-plugin-antdv-fix -D
//or
npm i vite-plugin-antdv-fix -D
```

~~~typescript
// vite.config.ts
import antdvFix from 'vite-plugin-antdv-fix'
import { defineConfig } from 'vite'
export default defineConfig({
  plugins: [
    antdvFix()
  ]
})
~~~
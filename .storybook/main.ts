import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
  async viteFinal(config) {
    const { mergeConfig } = await import('vite')
    const tsconfigPaths = (await import('vite-tsconfig-paths')).default
    const react = (await import('@vitejs/plugin-react')).default
    return mergeConfig(config, {
      plugins: [tsconfigPaths(), react({ jsxRuntime: 'automatic' })],
    })
  },
}

export default config

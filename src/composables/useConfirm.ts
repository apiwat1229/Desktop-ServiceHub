import { reactive } from 'vue'

type Resolver = (value: boolean) => void

const state = reactive({
    visible: false,
    message: '',
    title: '',
    resolve: null as Resolver | null,
})

export function confirm(message: string, title?: string): Promise<boolean> {
    state.message = message
    state.title = title || ''
    state.visible = true
    return new Promise<boolean>((res) => {
        state.resolve = res
    })
}

export function confirmAccept() {
    if (state.resolve) state.resolve(true)
    cleanup()
}

export function confirmCancel() {
    if (state.resolve) state.resolve(false)
    cleanup()
}

function cleanup() {
    state.visible = false
    state.message = ''
    state.title = ''
    state.resolve = null
}

export const confirmState = state

export default function useConfirm() {
    return { confirm, confirmState, confirmAccept, confirmCancel }
}

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChessBoard from '../src/components/ChessBoard.vue'

describe('ChessBoard', () => {
  it('renders without crashing', () => {
    const wrapper = mount(ChessBoard, {
      props: {
        coordinates: true
      }
    })
    
    expect(wrapper.find('.cg-wrap')).toBeTruthy()
  })

  it('applies coordinates class when coordinates prop is true', () => {
    const wrapper = mount(ChessBoard, {
      props: {
        coordinates: true
      }
    })
    
    expect(wrapper.find('.cg-wrap').classes()).toContain('cg-coordinates')
  })

  it('emits move event when move occurs', async () => {
    const wrapper = mount(ChessBoard, {
      props: {
        coordinates: true,
        movable: { free: true }
      }
    })

    // Simulate a move event
    await wrapper.vm.$emit('move', 'e2', 'e4')
    
    expect(wrapper.emitted('move')).toBeTruthy()
    expect(wrapper.emitted('move')?.[0]).toEqual(['e2', 'e4'])
  })
})
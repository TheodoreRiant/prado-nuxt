import { defineComponent, ref, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';

const ERROR_IMG_SRC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ImageWithFallback",
  __ssrInlineRender: true,
  props: {
    src: {},
    alt: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const didError = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(didError)) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["inline-block bg-gray-100 text-center align-middle", props.class]
        }, _attrs))}><div class="flex items-center justify-center w-full h-full"><img${ssrRenderAttr("src", ERROR_IMG_SRC)} alt="Error loading image"${ssrRenderAttr("data-original-url", props.src)}></div></div>`);
      } else {
        _push(`<img${ssrRenderAttrs(mergeProps({
          src: props.src,
          alt: props.alt,
          class: props.class
        }, _attrs))}>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ImageWithFallback.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ImageWithFallback-Bk7PjeIe.mjs.map

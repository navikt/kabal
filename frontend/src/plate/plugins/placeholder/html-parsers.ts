import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';

interface Props {
  element: HTMLElement;
}

export const parsers = {
  html: {
    deserializer: {
      isElement: true,
      parse: ({ element }: Props) => ({
        type: ELEMENT_PLACEHOLDER,
        placeholder: element.getAttribute('data-raw-placeholder') ?? 'fyll inn',
      }),
      rules: [{ validAttribute: { 'data-node-type': ELEMENT_PLACEHOLDER } }],
    },
  },
};

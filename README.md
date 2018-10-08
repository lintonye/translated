Translate all text on a UI. 

- Connect the component to any root level frame, scroll or stack. 
- Specify a language code. See [here](https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/) for a complete list of language codes.

The text inside will be translated to desired language.

## Known Issues
- For a complex frame that contains many items, or if too many instances of this component are placed on the canvas, there will be a "Component exceed time limit" error. However, it should still work in the preview.

## Change log
- 10/08/2018
  - Initial release

---

## Requirements for the use of translation results (from Yandex)
According to the Terms of Use for the Yandex.Translate service, the text Powered by Yandex.Translate must be shown above or below the translation result, with a clickable link to the page http://translate.yandex.com/.

- Requirements for placing this text
  - This text must be shown:
    - In the description of the software product (on the About page).
    - In the help for the software product.
    - On the official website of the software product.
    - On all pages or screens where data from the service is used.
- Requirements for font color
  - The font color of this text must match the font color of the main text.
- Requirements for font size
  The font size of this text must not be smaller than the font size of the main text.
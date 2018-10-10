import * as React from "react";
import { PropertyControls, ControlType, Frame } from "framer";
import { translate } from "./translate";
import StaggeredCloner from "./StaggeredCloner";

// Define type of property
interface Props {
  toLang: string;
  apiKey: string;
}

const yandexTitleStyle: React.CSSProperties = {
  fontSize: 7
};

const Message = ({ title, description }) => (
  <div
    style={{
      padding: 5,
      background: "rgba(0, 99, 255, 0.5)",
      height: "100%",
      color: "white",
      textAlign: "center"
    }}
  >
    <h1>{title}</h1>
    {description}
  </div>
);

const translateHtml = async ({ html, toLang, apiKey }) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const root = doc.body.childNodes[0];
  const translateTextNode = async (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const translated = await translate({
        text: node.textContent,
        toLang,
        apiKey
      });
      node.textContent = translated;
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        const n = node.childNodes[i];
        await translateTextNode(n);
      }
    }
  };
  await translateTextNode(root);

  const s = new XMLSerializer();
  return s.serializeToString(root);
};

const translateBlocks = async ({ blocks, toLang, apiKey }) =>
  await Promise.all(
    blocks.map(async block => {
      const text = await translate({ text: block.text, toLang, apiKey });
      return { ...block, text };
    })
  );

export class Translated extends React.Component<Props> {
  // Set default properties
  static defaultProps = {
    toLang: "zh",
    apiKey:
      "trnsl.1.1.20181003T054221Z.d2be70eac0925141.2897bc6cbf06ec637dd4e072f89eeaa6f1c0d792"
  };

  // Items shown in property panel
  static propertyControls: PropertyControls = {
    toLang: { type: ControlType.String, title: "Translate to" }
  };

  state = {
    error: null,
    loading: false
  };

  translateProps = async propsOnChild => {
    const { toLang, apiKey } = this.props;
    const { rawHTML, contentState, text } = propsOnChild;
    let propsToUpdate = null;
    if (rawHTML) {
      const translatedHtml = await translateHtml({
        html: rawHTML,
        toLang,
        apiKey
      });
      propsToUpdate = { rawHTML: translatedHtml };
    } else if (contentState) {
      // Text inside a component instance seems to have a contentState
      const { blocks } = contentState;
      if (blocks && blocks.length > 0) {
        const translatedBlocks = await translateBlocks({
          blocks,
          toLang,
          apiKey
        });
        propsToUpdate = {
          contentState: { ...contentState, blocks: translatedBlocks }
        };
      }
    } else if (typeof text === "string") {
      const translated = await translate({ text, toLang, apiKey });
      propsToUpdate = { text: translated };
    }
    return propsToUpdate;
  };

  render() {
    const { error, loading } = this.state;
    const { children } = this.props;

    if (!!error) {
      return <Message title="Error" description={error} />;
    } else if (loading) {
      return (
        <Message title="Translating..." description="Wait a split second." />
      );
    } else if (children[0]) {
      return (
        <Frame {...this.props} background={null}>
          <div style={yandexTitleStyle}>
            Powered by{" "}
            <a href="http://translate.yandex.com/">Yandex.Translate</a>
          </div>
          <StaggeredCloner onUpdateProps={this.translateProps}>
            {children}
          </StaggeredCloner>
        </Frame>
      );
    } else {
      return (
        <Message
          title="Translated"
          description="Connect to a Frame to translate it"
        />
      );
    }
  }
}

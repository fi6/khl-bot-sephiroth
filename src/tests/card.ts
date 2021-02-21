import { cardParser } from 'utils/card-parser';

let card1 = `
    {
      "type": "card",
      "theme": "info",
      "size": "lg",
      "modules": [
        {
          "type": "header",
          "text": {
            "type": "plain-text",
            "content": "创建房间"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "kmarkdown",
            "content": "创建房间的完整指令格式："
          }
        },
        {
          "type": "section",
          "text": {
            "type": "kmarkdown",
            "content": "创建房间后，你可以广播给频道内所有人。"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "kmarkdown",
            "content": ""
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "plain-text",
            "content": "你也可以点击右侧按钮，机器人将协助你创建。"
          },
          "mode": "right",
          "accessory": {
            "type": "button",
            "theme": "success",
            "click": "return-val",
            "text": {
              "type": "plain-text",
              "content": "开始创建"
            }
          }
        }
      ]
    }
  
`;

let card2 = `
    {
      "type": "card",
      "theme": "secondary",
      "size": "lg",
      "modules": [
        {
          "type": "divider"
        }
      ]
    }
  `;

console.log(cardParser(card1, card2));

import { POST_NUMBER, DELIVERY_INIT, DELIVERY_DATA, DELIVERY_LIST } from './constants/index.js';
import WebStorage from './servises/WebStorage.js';

class Delivery {
  constructor() {
    this.body = document.body;
    this.deliveryList = document.getElementById('delivery-list-container');

    this.getStorageListData();
    this.eventListener();

    if(WebStorage.get(POST_NUMBER)) WebStorage.remove(POST_NUMBER);
  }

  getStorageListData() {
    let deliverydata = WebStorage.get(DELIVERY_DATA);
        deliverydata = deliverydata && deliverydata.length  ? deliverydata : [ DELIVERY_INIT ];

    while(this.deliveryList.firstChild) {
      this.deliveryList.removeChild(this.deliveryList.firstChild);
    }

    deliverydata.forEach((delivery, i) => {
      if(!delivery.hasOwnProperty('label') || delivery.label === '') delivery.label = '라벨';
      this.appendDeliveryListDOM(delivery, i);
    });

    WebStorage.set(DELIVERY_DATA, deliverydata);
  }

  appendDeliveryListDOM(deliveryData, i) {
    const { idx, label, code } = deliveryData;
    const container = document.createElement('div');
          container.className = 'delivery-container';
          container.setAttribute('data-d-Index', idx);
          container.setAttribute('data-c-Index', i);
    const arrowText = document.createTextNode('›');
    const arrow = document.createElement('span');
          arrow.appendChild(arrowText);
    const deliveryText = document.createTextNode(DELIVERY_LIST[idx].name);
    const delivery = document.createElement('p');
          delivery.className = 'select-box';
          delivery.appendChild(deliveryText);
          delivery.appendChild(arrow);
    const deliveryBox = document.createElement('div');
          deliveryBox.appendChild(delivery);
    const labelInput = document.createElement('input');
          labelInput.setAttribute('class', 'delivery-label');
          labelInput.setAttribute('type', 'text');
          labelInput.setAttribute('value', label);
    const selectBox = document.createElement('ul');
          selectBox.className = 'select-box-list';
          selectBox.style.display = 'none';
    const input = document.createElement('input');
          input.setAttribute('class', 'delivery-number');
          input.setAttribute('type', 'text');
          input.setAttribute('value', code);
    const buttonText = document.createTextNode('조회');
    const button = document.createElement('button');
          button.className = 'delivery-btn';
          button.appendChild(buttonText);
    const closeText = document.createTextNode('×');
    const closeBtn = document.createElement('span');
          closeBtn.className = 'delete-btn';
          closeBtn.appendChild(closeText);


    for(let i=0; i<DELIVERY_LIST.length; i++) {
      const list = document.createElement('li');
            list.className = 'choice-delivery';
            list.setAttribute('data-index', i);
      const deliveryText = document.createTextNode(DELIVERY_LIST[i].name);
      list.appendChild(deliveryText);
      selectBox.appendChild(list);
    }

    deliveryBox.appendChild(selectBox);
    container.appendChild(labelInput);
    container.appendChild(deliveryBox);
    container.appendChild(input);
    container.appendChild(button);
    container.appendChild(closeBtn);

    this.deliveryList.appendChild(container);
  }

  eventListener() {
    this.body.addEventListener('click', (e) => {
      const selectbox = document.getElementsByClassName('select-box-list');
      const tName = e.target.className;

      if(tName === 'delivery-btn') {
        const deliveryList = WebStorage.get(DELIVERY_DATA);
        const container = e.target.parentElement;
        const cIndex = container.dataset.cIndex;
        const dIndex = container.dataset.dIndex;
        const apiTarget = DELIVERY_LIST[dIndex].name;
        const apiUrl = DELIVERY_LIST[dIndex].api;
        const postLabel = container.children[0].value;
        const postNumber = container.children[2].value;

        deliveryList[cIndex].idx = dIndex;
        deliveryList[cIndex].code = postNumber;
        deliveryList[cIndex].label = postLabel;
        WebStorage.set(DELIVERY_DATA, deliveryList);

        if(apiTarget === '대신 택배') {
          const billno1 = '?billno1=' + String(postNumber).substring(0, 4);
          const billno2 = '&billno2=' + String(postNumber).substring(4, 7);
          const billno3 = '&billno3=' + String(postNumber).substring(7, 13);

          window.open(apiUrl+billno1+billno2+billno3, apiTarget, 'resizable=yes,scrollbars=yes,width=720,height=600');
        } else {
          window.open(apiUrl+postNumber, apiTarget, 'resizable=yes,scrollbars=yes,width=720,height=600');
        }
      }

      if(tName === 'select-box') {
        const display = e.target.nextElementSibling.style.display === 'none' ? 'block' : 'none';

        e.target.nextElementSibling.style.display = display;
      } else {
        for(const select of selectbox) {
          if(select.style.display === 'block') {
            select.style.display = 'none';
          }
        }
      }

      if(tName === 'add-delivery') {
        const deliveryList = WebStorage.get(DELIVERY_DATA);

        deliveryList.push(DELIVERY_INIT);
        WebStorage.set(DELIVERY_DATA, deliveryList);
        this.getStorageListData();
      }

      if(tName === 'delete-btn') {
        const idx = Number(e.target.parentElement.dataset.cIndex);
        const deliveryList = WebStorage.get(DELIVERY_DATA);

        deliveryList.splice(idx, 1);
        WebStorage.set(DELIVERY_DATA, deliveryList);
        this.getStorageListData();
      }

      if(tName === 'choice-delivery') {
        const index = e.target.dataset.index;
        const deliveryName = e.target.innerText;
        const deliveryBox = e.target.parentElement.previousSibling.parentElement.parentElement;
        const deliveryElement = e.target.parentElement.previousSibling;

        deliveryBox.dataset.dIndex = index;
        deliveryElement.innerHTML = deliveryName + ' <span>›</span>';
      }

    }, {
      capture: true
    });
  }



}


new Delivery();
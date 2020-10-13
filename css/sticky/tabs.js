(function(w) {

  function holderFactory({
    text,
  }) {

    const template = `
      <div id="holder">
        ${text}
      </div>
    `
    return template;
  }

  function tabFactory({
    text
  }) {

    return `
      <div class="tab"> 
        ${text}
      </div>
    `
  }

  function tabWrapFactory() {

    return `
      <div id="tab-wrap"> 

      </div>
    `
  }


  class Tabs {
    constructor(options, ...tabs) {
      this.tabs = tabs; 
      this.options = options;
      this.activedIndex = options.activedIndex;

      this.text = this.tabs[this.activedIndex].text;

      this.moveLock = false;

      this.renderHolder();
      this.renderTabWrap();
      this.renderTabContainer();

      this.renderTabStyle();
      this.renderHolderStyle();
      this.renderTabWrapStyle();

      this.bindEvent();
    }

    bindEvent() {
      this.holder = document.getElementById('holder');
      this.tabWrap = document.getElementById('tab-wrap');

      this.holder.addEventListener('click', this.holderHidden);
      this.holder.addEventListener('transitionend', this.tabWrapShow);

      this.tabWrap.addEventListener('click', this.tabWrapClick);
      this.tabWrap.addEventListener('transitionend', this.holderShow);
    }

    holderHidden = () => {
      const { width } = this.holder.getBoundingClientRect();
      this.holder.style.right = `-${width + 10}px`;

      this.moveLock = false;
    }

    holderShow = () => {
      if (this.moveLock) return;
      this.holder.style.right = '0';
      this.moveLock = true;
    }

    tabWrapShow = () => {
      if (this.moveLock) return;
      this.tabWrap.style.right = '0';
      this.moveLock = true;
    }

    tabWrapClick = (e) => {
      const target = e.target;

      const children = [...this.tabWrap.children];

      const activedIndex = this.activedIndex = children.indexOf(target);

      if (!~activedIndex) return;

      this.tabs.forEach((tab, index) => {
        tab.hidden();

        this.tabWrap.children[index].className = 'tab';
      });

      this.tabs[activedIndex].show();
      this.tabWrap.children[activedIndex].className += ' actived';

      const { width } = this.tabWrap.getBoundingClientRect();
      this.tabWrap.style = `right: -${width + 10}px`;
      this.moveLock = false;

      this.updateHolder();
    } 

    updateHolder = () => {
      this.text = this.tabs[this.activedIndex].text;

      this.holder.innerText = this.text;
    }

    tabsShow = () => {
      this.tabWrap.style = 'right: 0';
    }

    renderHolder() {
      const { holderRoot = document.body } = this.options;

      holderRoot.innerHTML += holderFactory({ text: this.text });
    }

    renderTabWrap() {
      const { tabWrapRoot = document.body } = this.options;

      tabWrapRoot.innerHTML += tabWrapFactory();
      
      this.tabWrap = document.getElementById('tab-wrap');

      this.tabs.forEach(tab => this.tabWrap.innerHTML += tabFactory({ text: tab.text }));
      this.tabWrap.children[this.activedIndex].className += ' actived';
    }

    renderTabContainer() {
      const { tabContainerRoot = 'body' } = this.options;
      this.tabs.forEach(tab => tab.mount({ root: tabContainerRoot }));
      this.tabs[this.activedIndex].show();
    }

    renderHolderStyle() {
      document.head.innerHTML += `
        <style>
          #holder {
            position: fixed;
            top: 50%;
            right: 0;

            width: 100px;
            padding: 5px;

            text-align: center;
            word-break: break-all;

            transform: translateY(-50%);

            background-color: #f5f5f5;
            border-radius: 5px;

            cursor: pointer;

            transition: right 0.25s ease-in 0.2s, opacity 0.35s ease-in 0.2s;
          } 
        </style>
      `;
    }

    renderTabWrapStyle() {
      document.head.innerHTML += `
        <style>
          #tab-wrap {
            position: fixed;
            top: 50%;
            right: -150px;

            padding: 5px;

            text-align: center;
            word-break: break-all;

            transform: translateY(-50%);

            background-color: #f5f5f5;
            border-radius: 5px;

            cursor: pointer;

            transition: right 0.25s ease-in 0.2s, opacity 0.35s ease-in 0.2s;
          } 
        </style>
      `;
    }

    renderTabStyle() {
      document.head.innerHTML += `
        <style>
          .tab {
            display: flex;
            align-items: center;
            justify-content: center;

            max-width: 100px;
            margin: 20px;

            border-radius: 10px;
          }

          .tab.actived {
            font-weight: 700;
            color: #FFF;

            background: aqua;
          }
        </style>
      `;
    }
  }

  w.Tabs = Tabs;
}(window))
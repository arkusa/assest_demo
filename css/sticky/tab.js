(function(w) {
  class Tab {
    constructor(props) {
      this.text = props.text;
      this.style = props.style;
      this.template = props.template;
    }

    mount({
      root,
    }) {
      document.querySelector(root).innerHTML += this.template;
      document.head.innerHTML += `<style>${this.style}</style>`;

      this.root = root;
      this.index = document.querySelector(root).children.length - 1;
      this.hidden();
    }

    show = () => {
      document.querySelector(this.root).children[this.index].style.display = 'block';
    }

    hidden = () => {
      document.querySelector(this.root).children[this.index].style.display = 'none';
    }
  }

  w.Tab = Tab;
}(window))
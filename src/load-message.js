export default () => {
  const node = document.createElement(`div`);
  node.style = `width: 800px; margin: 20px auto; padding: 10px; text-align: center; background-color: yellow; color: black; font-size: 24px;`;
  node.textContent = `Loading movies...`;
  document.body.appendChild(node);
  return node;
};





export function CenterCardWrapper(wrapper: HTMLElement) {
    const width = parseFloat(getComputedStyle(wrapper).width);
    if (width < 640) {
      let padding = 1;
      if (width > (22 * 16))
        padding = (width - (22 * 16)) / 2 / 16;
      wrapper.style.paddingLeft = padding+'rem';
      wrapper.style.paddingRight = padding+'rem';
    } else {
      wrapper.style.paddingLeft = '';
      wrapper.style.paddingRight = '';
    }
}
import {Animation, AnimationController} from '@ionic/angular';
const animationController = new AnimationController();

export abstract class NavStack {
  public static lastNav = '';
}

export const pageAnimator = (
  _: HTMLElement,
  opts: any,
  animationCtrl = animationController
): Animation => {
  let currNav = opts.enteringEl.ownerDocument.location.pathname;

  //Fix nav stack for tabbed pages
  if (currNav == '/account/summary') {
    currNav = '/account';
  }
  if (currNav.includes('/coverages/coverage-tabs')) {
    currNav = '/coverages';
  }

  const lastLength = NavStack.lastNav.split('/').length;
  const currLength = currNav.split('/').length;

  // create root transition
  const rootTransition = animationCtrl
    .create()
    .duration(150)
    .easing('cubic-bezier(0.7,0,0.3,1)');

  const enterTransition = animationCtrl.create().addElement(opts.enteringEl);
  const exitTransition = animationCtrl.create().addElement(opts.leavingEl);

  enterTransition.fromTo('opacity', '0', '1');
  exitTransition.fromTo('opacity', '1', '0');

  if (lastLength > currLength) {
    enterTransition.fromTo('transform', 'translateX(-100%)', 'translateX(0%)');
    exitTransition.fromTo('transform', 'translateX(0%)', 'translateX(100%)');
  } else if (lastLength < currLength) {
    enterTransition.fromTo('transform', 'translateX(100%)', 'translateX(0%)');
    exitTransition.fromTo('transform', 'translateX(0%)', 'translateX(-100%)');
  }

  rootTransition.addAnimation([enterTransition, exitTransition]);

  NavStack.lastNav = currNav;

  return rootTransition;
};

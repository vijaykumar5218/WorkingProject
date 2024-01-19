import {NavStack, pageAnimator} from './animations';

let mockAnimationCtrl;
let animationSpy;

describe('Animations', () => {
  let baseOpts;
  beforeEach(() => {
    animationSpy = jasmine.createSpyObj('Animation', [
      'duration',
      'easing',
      'addElement',
      'fromTo',
      'addAnimation',
    ]);

    mockAnimationCtrl = jasmine.createSpyObj('AnimationController', ['create']);
    mockAnimationCtrl.create.and.returnValue(animationSpy);
    animationSpy.duration.and.returnValue(animationSpy);
    animationSpy.addElement.and.returnValue(animationSpy);
    animationSpy.easing.and.returnValue(animationSpy);

    baseOpts = {
      enteringEl: {
        element: 'testA',
        ownerDocument: {
          location: {
            pathname: 'account/test/a',
          },
        },
      },
      leavingEl: {
        element: 'testB',
      },
    };
  });

  it('should set /account/summary to /account to compensate for tabs', () => {
    const opts = {
      enteringEl: {
        element: 'testA',
        ownerDocument: {
          location: {
            pathname: '/account/summary',
          },
        },
      },
      leavingEl: {
        element: 'testB',
      },
    };

    pageAnimator({} as HTMLElement, opts, mockAnimationCtrl);

    expect(NavStack.lastNav).toEqual('/account');
  });

  it('should set /coverages/coverage-tabs to /coverages to compensate for tabs', () => {
    const opts = {
      enteringEl: {
        element: 'testA',
        ownerDocument: {
          location: {
            pathname: '/coverages/coverage-tabs',
          },
        },
      },
      leavingEl: {
        element: 'testB',
      },
    };

    pageAnimator({} as HTMLElement, opts, mockAnimationCtrl);

    expect(NavStack.lastNav).toEqual('/coverages');
  });

  it('should create base animation and add opacity animations and set lastNav', () => {
    NavStack.lastNav = '/account/test/a';

    pageAnimator({} as HTMLElement, baseOpts, mockAnimationCtrl);

    expect(mockAnimationCtrl.create).toHaveBeenCalled();
    expect(animationSpy.duration).toHaveBeenCalledWith(150);
    expect(animationSpy.easing).toHaveBeenCalledWith(
      'cubic-bezier(0.7,0,0.3,1)'
    );

    expect(animationSpy.addElement).toHaveBeenCalledWith(baseOpts.enteringEl);
    expect(animationSpy.addElement).toHaveBeenCalledWith(baseOpts.leavingEl);
    expect(animationSpy.fromTo).toHaveBeenCalledWith('opacity', '0', '1');
    expect(animationSpy.fromTo).toHaveBeenCalledWith('opacity', '1', '0');

    expect(NavStack.lastNav).toEqual('account/test/a');
  });

  it('should add navigate left animation', () => {
    NavStack.lastNav = '/account/test/a/b/c/d';

    pageAnimator({} as HTMLElement, baseOpts, mockAnimationCtrl);

    expect(animationSpy.fromTo.calls.all()[2].args[0]).toEqual('transform');
    expect(animationSpy.fromTo.calls.all()[2].args[1]).toEqual(
      'translateX(-100%)'
    );
    expect(animationSpy.fromTo.calls.all()[2].args[2]).toEqual(
      'translateX(0%)'
    );

    expect(animationSpy.fromTo.calls.all()[3].args[0]).toEqual('transform');
    expect(animationSpy.fromTo.calls.all()[3].args[1]).toEqual(
      'translateX(0%)'
    );
    expect(animationSpy.fromTo.calls.all()[3].args[2]).toEqual(
      'translateX(100%)'
    );
  });

  it('should add navigate right animation', () => {
    NavStack.lastNav = '/account';

    pageAnimator({} as HTMLElement, baseOpts, mockAnimationCtrl);

    console.log('test : ', animationSpy.fromTo.calls.all());

    expect(animationSpy.fromTo.calls.all()[2].args[0]).toEqual('transform');
    expect(animationSpy.fromTo.calls.all()[2].args[1]).toEqual(
      'translateX(100%)'
    );
    expect(animationSpy.fromTo.calls.all()[2].args[2]).toEqual(
      'translateX(0%)'
    );

    expect(animationSpy.fromTo.calls.all()[3].args[0]).toEqual('transform');
    expect(animationSpy.fromTo.calls.all()[3].args[1]).toEqual(
      'translateX(0%)'
    );
    expect(animationSpy.fromTo.calls.all()[3].args[2]).toEqual(
      'translateX(-100%)'
    );
  });
});

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MessageCenterPage} from './message-center.page';
import {RouterTestingModule} from '@angular/router/testing';
import {ContentService} from '@web/app/modules/shared/services/content/content.service';
import {of, Subscription} from 'rxjs';

describe('WorkplaceDashboardPage', () => {
  let component: MessageCenterPage;
  let fixture: ComponentFixture<MessageCenterPage>;
  let contentServiceSpy;
  let fetchCatchupContentSpy;

  const catchUpContentMockData =
    '{"catchupHeader":"Let\u2019s Catch Up","catchupViewallButton":"View All","catchupReadmoreButton":"Read more","catchupBackButton":"Back","noCatchUpText":"You\u2019re all caught up!","messageCenter":{"header":"Message Center","recentMsgTxt":"Recent","highPriorityMsgTxt":"High Priority","newMsgTxt":"NEW!"}}';

  const catchupMessageHubMockData =
    '{"catchUp":[{"eventName":"Account Aggregated","Category_name":"catchUp","Title":"Add a Beneficiary","Description":"Our records indicate that you have no beneficiary designated in your account.","Link_name":"Add a Beneficiary now","Link_url":"","eventStartDt":"2022-07-21T16:02:09","eventEndDt":"2022-07-21T17:32:07","eventAge":"12 days ago"},{"eventName":"Journey Not Completed","Category_name":"catchUp","Title":"Enrollment season","Description":"It\u2019s open enrollment season! Make sure you select your benefits by the end of next week","Link_name":"","Link_url":"","eventStartDt":"2022-07-06T09:45:30","eventEndDt":"2022-07-06T10:03:38","eventAge":"27 days ago"},{"eventName":"Journey Not Completed","Category_name":"catchUp","Title":"Stay smart while online","Description":" The idea of needing to be mindful of your financial cybersecurity isn\u2019t new - but","Link_name":"","Link_url":"","eventStartDt":"2022-07-05T16:16:54","eventEndDt":"2022-07-05T16:45:01","eventAge":"28 days ago"}],"highPriority":[{"eventName":"Account Aggregated","Category_name":"highPriority","Title":"Add your external account","Description":"Add in your outside accounts to power up myVoyage and get more insight into your finances.","Link_name":"","Link_url":"","eventStartDt":"2022-07-21T16:02:09","eventEndDt":"2022-07-21T17:32:07","eventAge":"12 days ago"}],"recent":[{"eventName":"Account Aggregated","Category_name":"Recent","Title":"Add your external account","Description":"Add in your outside accounts to power up myVoyage and get more insight into your finances.","Link_name":"","Link_url":"","eventStartDt":"2022-07-21T16:02:09","eventEndDt":"2022-07-21T17:32:07","eventAge":"12 days ago"}]}';

  beforeEach(
    waitForAsync(() => {
      contentServiceSpy = jasmine.createSpyObj('contentServiceSpy', [
        'getCatchUpMessageHub',
        'getCatchupContent',
      ]);
      contentServiceSpy.getCatchUpMessageHub.and.returnValue({
        subscribe: () => undefined,
      });
      contentServiceSpy.getCatchupContent.and.returnValue({
        subscribe: () => undefined,
      });
      TestBed.configureTestingModule({
        declarations: [MessageCenterPage],
        imports: [RouterTestingModule],
        providers: [
          {
            provide: ContentService,
            useValue: contentServiceSpy,
          },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(MessageCenterPage);
      component = fixture.componentInstance;
      fetchCatchupContentSpy = spyOn(component, 'fetchCatchupContent');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let observable;
    let subscription;
    const mockData = JSON.parse(catchupMessageHubMockData);
    beforeEach(() => {
      subscription = new Subscription();
      observable = of(mockData);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscription;
      });
      contentServiceSpy.getCatchUpMessageHub.and.returnValue(observable);
      component.catchUpMessageData = undefined;
      spyOn(component['subscription'], 'add');
    });
    it('should call getCatchUpMessageHub and set the value of catchUpMessageData', () => {
      component.ngOnInit();
      expect(contentServiceSpy.getCatchUpMessageHub).toHaveBeenCalled();
      expect(component.catchUpMessageData).toEqual(mockData);
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
    });
    it('should call fetchCatchupContent', () => {
      component.ngOnInit();
      expect(component.fetchCatchupContent).toHaveBeenCalled();
    });
  });

  describe('fetchCatchupContent', () => {
    let observable;
    let subscription;
    const mockData = JSON.parse(catchUpContentMockData);
    beforeEach(() => {
      subscription = new Subscription();
      observable = of(mockData);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscription;
      });
      contentServiceSpy.getCatchupContent.and.returnValue(observable);
      component.catchUpData = undefined;
      spyOn(component['subscription'], 'add');
      fetchCatchupContentSpy.and.callThrough();
    });
    it('should call getCatchupContent and set the value of catchUpData', () => {
      component.ngOnInit();
      expect(contentServiceSpy.getCatchupContent).toHaveBeenCalled();
      expect(component.catchUpData).toEqual(mockData);
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      spyOn(component['subscription'], 'unsubscribe');
    });
    it('should call unsubscribe', () => {
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});

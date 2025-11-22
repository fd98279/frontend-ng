import { Injectable } from '@angular/core';
import { SettingsService } from '../common/settings.service';
import { HttpClient } from '@angular/common/http';
import { IAppConstant } from '../common/appconstant.model';
import { RxjsHelperService } from '../common/rxjs.helper.service';
import { catchError } from 'rxjs/operators';
import { IPortfolio } from './portfolio.model';

@Injectable()
export class PortfolioService {

    appConstants: IAppConstant;
    device: string;

    constructor(private http: HttpClient,
        private settingsService: SettingsService,
        private rxjsHelperService: RxjsHelperService) {
        this.appConstants = settingsService.getAppConstants();
        this.device = this.settingsService.getAppSettings().isMobile ? 'mobile' : 'pc';
    }


    getAllPortfolios() {
        return this.http.get<IPortfolio[]>(this.settingsService.getAppConstants().portfolioServiceBaseUri + '/portfolios')
            .pipe(catchError(this.rxjsHelperService.handleError<IPortfolio[]>('getAllPortfolios', [])));
    }

    getPortfoliosByUser() {
        return this.http.get<IPortfolio[]>(this.settingsService.getAppConstants().portfolioServiceBaseUri + '/userassets')
            .pipe(catchError(this.rxjsHelperService.handleError<IPortfolio[]>('getPortfoliosByUser', [])));
    }

    deletePortfolio(portfolioID) {
        return this.http.delete(this.settingsService.getAppConstants().portfolioServiceBaseUri + '/portfolios/' + portfolioID)
            .pipe(catchError(this.rxjsHelperService.handleError<IPortfolio[]>('deletePortfolio', [])));
    }

    createPortfolio(portfolio) {
        return this.http.post(this.settingsService.getAppConstants().portfolioServiceBaseUri + '/portfolios', portfolio)
        .pipe(catchError(this.rxjsHelperService.handleError<any>('createPortfolio', [])));
    }

    refreshPnL(portfolioId: string) {
        return this.http.get<any>(`${this.settingsService.getAppConstants().quotesServiceBaseUri}/pnl/calculate?portfolio_id=${portfolioId}`)
            .pipe(catchError(this.rxjsHelperService.handleError<any>('refreshPnL', null)));
    }


}

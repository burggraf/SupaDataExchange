import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  public commandline = '';
  public maskedCommandLine = '';
  public sourceType = 'csv';
  public source = {
    u: '',
    p: '',
    domain: '',
    port: '',
    dbname: '',
    url: ''
  };
  public dest = {
    u: 'postgres',
    p: '',
    domain: 'db.xxxxxxxxxxxxxxxxxxxx.supabase.co',
    port: '5432',
    dbname: 'postgres'
  };
  public sourceTypeDescription = {
    'csv': 'CSV / Tab / Delimited File',
    'fixed': 'Fixed Format File / IBM IXF',
    'db3': 'dBase DBF Format (DB3)',
    'sqlite': 'SQLite File',
    'mysql': 'MySQL',
    'mssql': 'Microsoft SQL Server',
    'postgres': 'PostgreSQL',
    'redshift': 'Redshift'
  };
  public result = '';
  constructor(
    private http: HttpClient,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }
  readyToImport() {
    let ready = false;
    switch (this.sourceType) {
      case 'csv':
      case 'fixed':
      case 'db3':
      case 'sqlite':
        // postgresql://[user[:password]@][netloc][:port][/dbname][?option=value&...]
        this.maskedCommandLine = `pgloader --type ${this.sourceType}\n ${this.source.url.trim()}\n postgres://${this.dest.u}:${'*'.repeat(this.dest.p.length)}@${this.dest.domain}:${this.dest.port}/${this.dest.dbname}`;
        this.commandline = `pgloader --type ${this.sourceType} ${this.source.url.trim()} postgres://${this.dest.u}:${this.dest.p}@${this.dest.domain}:${this.dest.port}/${this.dest.dbname}`;
        ready = (this.source.url.trim().length > 0 && 
            this.dest.u.trim().length > 0 &&
            this.dest.p.trim().length > 0 &&
            this.dest.domain.trim().length > 0 &&
            this.dest.port.trim().length > 0 &&
            this.dest.dbname.trim().length > 0
            );  
        return ready;        
        break;
      case 'mysql':
      case 'mssql':
      case 'postgres':
      case 'redshift':
        this.maskedCommandLine = `pgloader\n ${this.sourceType}://${this.source.u}:${'*'.repeat(this.source.p.length)}@${this.source.domain}:${this.source.port}/${this.source.dbname}\n ${this.source.url.trim()} postgres://${this.dest.u}:${'*'.repeat(this.dest.p.length)}@${this.dest.domain}:${this.dest.port}/${this.dest.dbname}`;
        this.commandline = `pgloader ${this.sourceType}://${this.source.u}:${this.source.p}@${this.source.domain}:${this.source.port}/${this.source.dbname} ${this.source.url.trim()} postgres://${this.dest.u}:${'*'.repeat(this.dest.p.length)}@${this.dest.domain}:${this.dest.port}/${this.dest.dbname}`;
        ready = (
          this.source.domain.trim().length > 0 &&
          this.source.dbname.trim().length > 0 &&
          this.dest.u.trim().length > 0 &&
            this.dest.p.trim().length > 0 &&
            this.dest.domain.trim().length > 0 &&
            this.dest.port.trim().length > 0 &&
            this.dest.dbname.trim().length > 0
            );
            return ready;      
        break;
    }
  }

  async run() {
    console.log('*** calling http.post -> /run');
    const loading = await this.loadingController.create({
      /// cssClass: 'my-custom-class',
      message: 'Importing data...please wait...'
    });
    this.result = '';
    await loading.present();
    this.http.post('/run', {
      commandline: this.commandline
    }).subscribe((data: any) => {
      console.log('*** response data', data);
      loading.dismiss();
      if (data.error) {
        this.result = data.error;
      } else {
        this.result = data.result;
      }      
      this.scrollToLabel('results');
    }, error => {
      console.log(error);
      this.result = JSON.stringify(error);
      this.scrollToLabel('results');
      loading.dismiss();
    });
  }

  scrollToLabel(label) {
    var titleELe = document.getElementById(label);
    this.content.scrollToPoint(0, titleELe.offsetTop, 1000);
  }
}

// db://user:pass@host:port/dbname
// Where db might be of sqlite, mysql or mssql.
//
// postgresql://[user[:password]@][netloc][:port][/dbname][?option=value&...]
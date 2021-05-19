import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  public id = '';
  public commandline = '';
  public maskedCommandLine = '';
  public sourceType = 'csv';
  public source = {
    u: '',
    p: '',
    domain: '',
    port: '',
    dbname: '',
    url: '',
    fields: '',
    fieldDelimiter: ','
  };
  public dest = {
    u: 'postgres',
    p: '',
    domain: 'db.xxxxxxxxxxxxxxxxxxxx.supabase.co',
    port: '5432',
    dbname: 'postgres',
    tablename: ''
  };
  public sourceTypeDescription = {
    csv: 'CSV / Tab / Delimited File',
    fixed: 'Fixed Format File / IBM IXF',
    db3: 'dBase DBF Format (DB3)',
    sqlite: 'SQLite File',
    mysql: 'MySQL',
    mssql: 'Microsoft SQL Server',
    postgres: 'PostgreSQL',
    redshift: 'Redshift',
  };
  public result = '';
  public saveCheckbox: boolean = false;
  public configurationName = '';
  public configurations = [];
  public mode = 'edit';
  public header = true;

  constructor(
    private http: HttpClient,
    private loadingController: LoadingController,
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    const currentID = localStorage.getItem('currentID') || '';
    console.log('currentID', currentID);
    let strConfigs = localStorage.getItem('configurations');
    if (strConfigs) {
      this.configurations = JSON.parse(strConfigs);
    }
    const index = this.configurations.findIndex((c) => c.id == currentID);
    if (index > -1) {
      const config = this.configurations[index];
      this.id = config.id;
      this.sourceType = config.sourceType;
      this.source = config.source;
      this.dest = config.dest;
      this.saveCheckbox = true;
      this.configurationName = config.name;
    }
  }
  readyToImport() {
    let ready = false;
    switch (this.sourceType) {
      case 'csv':
        this.commandline = `--type ${this.sourceType}`;
        this.commandline += ` --field "${this.source.fields.replace(/ /g, '')}"`;
        this.commandline += ` --with "fields terminated by '${this.source.fieldDelimiter}'"`;
        this.commandline += ` --with "fields not enclosed"`; // TAB
        this.commandline += ` ${this.source.url.trim()} postgres://${this.dest.u}:${this.dest.p}@${this.dest.domain}:${this.dest.port}/${this.dest.dbname}`;
        this.commandline += `?tablename=${this.dest.tablename}`; 
        
        this.maskedCommandLine = `pgloader --type ${this.sourceType}`;
        this.maskedCommandLine += ` --field "${this.source.fields.replace(/ /g, '')}"`;
        this.maskedCommandLine += ` --with "fields terminated by '${this.source.fieldDelimiter}'"`;
        this.maskedCommandLine += ` --with "fields not enclosed"`; // TAB
        this.maskedCommandLine += ` ${this.source.url.trim()} postgres://${this.dest.u}:${'*'.repeat(this.dest.p.length)}@${this.dest.domain}:${this.dest.port}/${this.dest.dbname}`;
        this.maskedCommandLine += `?tablename=${this.dest.tablename}`; 
        ready =
          this.source.url.trim().length > 0 &&
          this.dest.u.trim().length > 0 &&
          this.dest.p.trim().length > 0 &&
          this.dest.domain.trim().length > 0 &&
          this.dest.port.trim().length > 0 &&
          this.dest.dbname.trim().length > 0;
          ready = ready && this.source.fields?.trim().length > 0;
          ready = ready && this.dest.tablename?.trim().length > 0;
        break;
      case 'fixed':
      case 'db3':
      case 'sqlite':
        // postgresql://[user[:password]@][netloc][:port][/dbname][?option=value&...]
        this.maskedCommandLine = `pgloader --type ${
          this.sourceType
        }\n ${this.source.url.trim()}\n postgres://${this.dest.u}:${'*'.repeat(
          this.dest.p.length
        )}@${this.dest.domain}:${this.dest.port}/${this.dest.dbname}`;
        this.commandline = `--type ${
          this.sourceType
        } ${this.source.url.trim()} postgres://${this.dest.u}:${this.dest.p}@${
          this.dest.domain
        }:${this.dest.port}/${this.dest.dbname}`;
        ready =
          this.source.url.trim().length > 0 &&
          this.dest.u.trim().length > 0 &&
          this.dest.p.trim().length > 0 &&
          this.dest.domain.trim().length > 0 &&
          this.dest.port.trim().length > 0 &&
          this.dest.dbname.trim().length > 0;
        break;
      case 'mysql':
      case 'mssql':
      case 'postgres':
      case 'redshift':
        this.maskedCommandLine = `pgloader\n ${this.sourceType}://${
          this.source.u
        }:${'*'.repeat(this.source.p.length)}@${this.source.domain}:${
          this.source.port
        }/${this.source.dbname}\n ${this.source.url.trim()} postgres://${
          this.dest.u
        }:${'*'.repeat(this.dest.p.length)}@${this.dest.domain}:${
          this.dest.port
        }/${this.dest.dbname}`;
        this.commandline = `${this.sourceType}://${this.source.u}:${
          this.source.p
        }@${this.source.domain}:${this.source.port}/${
          this.source.dbname
        } ${this.source.url.trim()} postgres://${this.dest.u}:${'*'.repeat(
          this.dest.p.length
        )}@${this.dest.domain}:${this.dest.port}/${this.dest.dbname}`;
        ready =
          this.source.domain.trim().length > 0 &&
          this.source.dbname.trim().length > 0 &&
          this.dest.u.trim().length > 0 &&
          this.dest.p.trim().length > 0 &&
          this.dest.domain.trim().length > 0 &&
          this.dest.port.trim().length > 0 &&
          this.dest.dbname.trim().length > 0;
        break;
    }
    return ready;
  }

  async run() {
    console.log('*** calling http.post -> /run');
    const loading = await this.loadingController.create({
      /// cssClass: 'my-custom-class',
      message: 'Importing data...please wait...',
    });
    this.result = '';
    await loading.present();
    if (!this.id) {
      this.id = this.uuid();
    }
    this.http
      .post('http://localhost:8080/run', {
        commandline: this.commandline,
        id: this.id,
      })
      .subscribe(
        (data: any) => {
          console.log('*** response data', data);
          loading.dismiss();
          if (data.error) {
            this.result = data.error;
          } else {
            this.result = data.result;
          }
          this.scrollToLabel('results');
        },
        (error) => {
          console.log(error);
          this.result = JSON.stringify(error);
          this.scrollToLabel('results');
          loading.dismiss();
        }
      );
  }

  scrollToLabel(label) {
    var titleELe = document.getElementById(label);
    this.content.scrollToPoint(0, titleELe.offsetTop, 1000);
  }
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      let random = (Math.random() * 16) | 0; // Nachkommastellen abschneiden
      let value = char === 'x' ? random : (random % 4) + 8; // Bei x Random 0-15 (0-F), bei y Random 0-3 + 8 = 8-11 (8-b) gemäss RFC 4122
      return value.toString(16);
    });
  }
  save() {
    console.log('save...');
    if (!this.id) {
      this.id = this.uuid();
    }
    const index = this.configurations.findIndex((c) => c.id == this.id);
    if (!this.saveCheckbox && index > -1) {
      // delete this configuration
      this.configurations.splice(index, 1);
      localStorage.setItem(
        'configurations',
        JSON.stringify(this.configurations)
      );
      localStorage.setItem('currentID', '');
      console.log('this.configurations', this.configurations);
    }
    if (!this.configurationName || !this.saveCheckbox) {
      return;
    }
    if (!this.readyToImport()) {
      return;
    }
    const config = {
      id: this.id,
      name: this.configurationName,
      sourceType: this.sourceType,
      source: this.source,
      dest: this.dest,
    };
    if (index < 0) {
      this.configurations.push(config);
    } else {
      this.configurations[index] = config;
    }
    console.log('*** configurations', this.configurations);
    console.log('currentID', this.id);
    localStorage.setItem('configurations', JSON.stringify(this.configurations));
    localStorage.setItem('currentID', this.id);
  }
  list() {
    if (this.mode === 'list') {
      this.mode = 'edit';
    } else {
      this.mode = 'list';
    }
    console.log('this.mode', this.mode);
  }
  load(config) {
    this.id = config.id;
    this.configurationName = config.name;
    this.sourceType = config.sourceType;
    this.source = config.source;
    this.dest = config.dest;
    this.mode = 'edit';
  }
  add() {
    this.source = {
      u: '',
      p: '',
      domain: '',
      port: '',
      dbname: '',
      url: '',
      fields: '',
      fieldDelimiter: ','
    };
    this.dest = {
      u: 'postgres',
      p: '',
      domain: 'db.xxxxxxxxxxxxxxxxxxxx.supabase.co',
      port: '5432',
      dbname: 'postgres',
      tablename: ''
    };
    this.id = this.uuid();
    this.configurationName = '';
    this.saveCheckbox = false;
  }
  duplicate() {
    this.id = this.uuid();
    this.configurationName = this.configurationName + ' copy';
    this.saveCheckbox = true;
    this.save();
  }
  async importFieldsFromHeader() {
    // "Range: bytes=0-1023"

    const loading = await this.loadingController.create({
      message: 'Reading headers from source url...please wait...',
    });

    await loading.present();

    let headers = new HttpHeaders()
      .set('Range', 'bytes=0-4096')
      .set('X-Requested-With', 'postgres-import-data');
    // https://github.com/bridgedxyz/base
    this.http
      .get(
        'https://cors.bridged.cc/' + this.source.url.replace('https://', ''),
        {
          headers: headers,
          responseType: 'text',
        }
      )
      .subscribe((response) => {
        console.log(response);
        const fields = response.split('\n')[0];
        const rx = new RegExp(this.source.fieldDelimiter,'g');
        this.source.fields = fields.replace(rx, ', ');
        loading.dismiss();
      },((error) => {
        console.error('Error', error);
        loading.dismiss();
      }));
  }
}

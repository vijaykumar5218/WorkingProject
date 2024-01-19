import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'centPipe',
})
export class CentPipePipe implements PipeTransform {
  //have kept data type to any as data might be number or string
  transform(value: string): string {
    return (parseInt(value) / 100).toString();
  }
}

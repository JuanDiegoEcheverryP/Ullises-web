import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapToIterable'
})
export class MapToIterablePipe implements PipeTransform {
  transform(map: Map<any, any>): Array<{ key: any, value: any }> {
    const iterableArray: Array<{ key: any, value: any }> = [];
    map.forEach((value, key) => {
      iterableArray.push({ key, value });
    });
    return iterableArray;
  }
}

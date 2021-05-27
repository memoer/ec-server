import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Lookup } from 'geoip-lite';

// test data

// {
//   range: [ 2049847296, 2049849343 ],
//   country: 'KR',
//   region: '11',
//   eu: '0',
//   timezone: 'Asia/Seoul',
//   city: 'Seongbuk-gu',
//   ll: [ 37.6027, 127.0145 ],
//   metro: 0,
//   area: 5
// }

@ObjectType()
export class GetGeoOutput implements Lookup {
  @Field(() => [Int])
  range!: [number, number];

  @Field(() => String)
  country!: string;

  @Field(() => String)
  region!: string;

  @Field(() => String)
  eu!: '1' | '0';

  @Field(() => String)
  timezone!: string;

  @Field(() => String)
  city!: string;

  @Field(() => [Float])
  ll!: [number, number];

  @Field(() => Int)
  metro!: number;

  @Field(() => Int)
  area!: number;
}

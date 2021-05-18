import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Lookup } from 'geoip-lite';

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

  @Field(() => [Int])
  ll!: [number, number];

  @Field(() => Int)
  metro!: number;

  @Field(() => Int)
  area!: number;
}

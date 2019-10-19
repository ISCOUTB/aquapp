export interface Action {
  name: string[];
  route: string[];
  parameters: { [prop: string]: string }[];
  icon: string;
  color: string;
  idPropertyName: string;
}

export interface Column {
  title: string;
  property: string;
}

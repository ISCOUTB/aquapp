import {
  UserRepository,
  ElementRepository,
  GlobalElementRepository,
} from '../repositories';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import * as vm2 from 'vm2';

export class FormTools {
  forbiddenProperties = ['user', 'trackedObject', 'sensor'];
  constructor(
    @repository(UserRepository)
    public repositorioUsuarios: UserRepository,
    @repository(ElementRepository)
    public repositorioElementos: ElementRepository,
    @repository(GlobalElementRepository)
    public repositorioElementosGlobales: GlobalElementRepository,
  ) {}

  async validateForm(campos: any[]) {
    for (const campo of campos) {
      const indice = this.forbiddenProperties.indexOf(campo.nombre);
      if (indice !== -1) {
        throw new HttpErrors.BadRequest(
          `Formulario inválido, trata de sobreescribir la propiedad: ${this.forbiddenProperties[indice]}`,
        );
      }
    }
  }

  async validateDatum(datum: any) {
    for (const property of Object.keys(datum)) {
      const index = this.forbiddenProperties.indexOf(property);
      if (index !== -1) {
        throw new HttpErrors.BadRequest(
          `Dato inválido, trata de sobreescribir la propiedad: ${this.forbiddenProperties[index]}`,
        );
      }
    }
  }

  async deserializeSensorForm(
    fields: any[],
    templates: any[],
    data: any,
  ) {
    if (!fields.length || !templates.length) {
      throw new HttpErrors.BadRequest(
        `No fields in the form or sensor`,
      );
    }
    const validations =
      (await this.repositorioElementosGlobales.find({
        where: {categoria: 'field-type-validation'},
      })) || [];
    const objects: any = {};
    const templateCache: any = {};
    const fieldCache: any = {};
    const validationCache: any = {};
    for (const field of fields) {
      fieldCache[field.nombre] = field;
    }
    for (const plantilla of templates) {
      templateCache[plantilla.nombre] = plantilla;
    }
    for (const validacion of validations) {
      validationCache[validacion.nombre] = validacion;
    }
    for (const property of Object.keys(data)) {
      const sensorField = fieldCache[property];
      if (sensorField === undefined || !sensorField.active) {
        continue;
      }
      const fieldTemplate = templateCache[property];
      if (fieldTemplate === undefined) {
        continue;
      }
      if (
        sensorField.transformation !== undefined &&
        typeof sensorField.transformation === 'string' &&
        sensorField.transformation.length
      ) {
        const validacion = validationCache[fieldTemplate.tipo];
        if (validacion === undefined) {
          throw new HttpErrors.BadRequest(
            `No hay validación para el tipo de dato ${fieldTemplate.tipo}. Contacte al administrador`,
          );
        }
        const vm = new vm2.VM({
          sandbox: {dato: data[property]},
          timeout: 1000,
          eval: false,
        });
        const script = new vm2.VMScript(sensorField.transformation);
        try {
          const datoTransformado = vm.run(script);
          this.validateField(
            datoTransformado,
            validacion.descripcion,
            property,
          );
          objects[property] = datoTransformado;
        } catch (error) {
          throw new HttpErrors[500](
            `Error transforming data for the field: ${property}. Details: ${error}`,
          );
        }
      } else {
        const validation = validationCache[fieldTemplate.tipo];
        if (validation === undefined) {
          throw new HttpErrors.BadRequest(
            `No hay validación para el tipo de dato ${fieldTemplate.tipo}. Contacte al administrador`,
          );
        }
        this.validateField(data[property], validation.descripcion, property);
        objects[property] = data[property];
      }
    }
    return objects;
  }

  validateField(value: any, validation: string, field: string) {
    const vm = new vm2.VM({
      sandbox: {datum: value},
      timeout: 1000,
      eval: false,
    });
    const script = new vm2.VMScript(validation);
    const result = vm.run(script);
    if (!result) {
      throw new HttpErrors.UnprocessableEntity(
        `Validation failed for field: ${field}`,
      );
    }
  }
}

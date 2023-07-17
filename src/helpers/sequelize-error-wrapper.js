// Errors
const {
   ApiUniqueConstraintError,
   ApiValidationError,
} = require("../errors/validation-errors");

// Constants
const errorsConsts = require("../constants/error-constants");

/**
 *  Wrapper para erros do Sequelize, a ideia é empacotar os erros para diminuir
 * as dependências com outras libs e mostrar melhores praticas. Thanks Uncle Bob (Robert Cecil Martinbert).
 */
class SequelizeErrorWrapper {
   /**
    * Empacota um erro, direcionando-o para seu respectivo método empacotador.
    *
    * @param {SequelizeError} e Erro que desejamos empacotar.
    */
   static wrapError(e) {
      switch (e.name) {
         case "SequelizeValidationError": {
            this.wrapValidationError(e);
         }
         case "SequelizeUniqueConstraintError": {
            this.wrapUniqueConstraintError(e);
         }
         default: {
            throw e;
         }
      }
   }

   /**
    * Empacota um SequelizeValidationError, extraindo as informações relevantes e
    * por fim lançando-as novamente com um erro padrão da Api.
    *
    * @param {SequelizeValidationError} e - Erro de validação do sequelize.
    * @throws {ApiValidationError} Erro empacotado.
    */
   static wrapValidationError(e) {
      const validationErrors = e.errors.map((err) => err.message);
      throw new ApiValidationError(
         errorsConsts.MSG_VALIDATION_ERROR,
         validationErrors
      );
   }

   /**
    * Empacota um SequelizeUniqueCosnstraintError, extraindo as informações relevantes e
    * por fim lançando-as novamente com um error padrão da Api.
    *
    * @param {SequelizeUniqueConstraintError} e - Erro de violação de chave primária do sequelize.
    */
   static wrapUniqueConstraintError(e) {
      const invalidFields = e.errors.map((err) =>
         errorsConsts.ERROR_UNIQUE_CONSTRAINT.replace(
            "{path}",
            err.path
         ).replace("{value}", err.value)
      );
      throw new ApiUniqueConstraintError(
         errorsConsts.MSG_UNIQUE_CONSTRAINT_ERROR,
         invalidFields
      );
   }
}

module.exports = SequelizeErrorWrapper;

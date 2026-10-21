<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

final class RoleCombinationValidator extends ConstraintValidator
{
    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!$constraint instanceof RoleCombination) {
            throw new UnexpectedTypeException($constraint, RoleCombination::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        if (!is_array($value)) {
            throw new UnexpectedValueException($value, 'array');
        }

        if (in_array('ROLE_METRICS', $value) && in_array('ROLE_ADMIN', $value)) {
            $this->context->buildViolation($constraint->messageRoleMetricsRoleAdmin)
                ->addViolation();
        }
    }
}

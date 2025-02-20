import { GenericErrors } from '@common/constants/error';
import { db } from '@config/db';
import { GoogleUser } from '@services/auth/types';
import { AppError } from '@common/error/appError';
import { Users } from '@services/user/models';
import { eq } from 'drizzle-orm';

const getOrCreateUserWithGoogle = async (profile: GoogleUser) => {
  const updateObject = {
    googleId: profile.id,
    avatar: profile.picture,
    displayName: profile.name,
    email: profile.email,
    firstName: profile.given_name,
    lastName: profile.family_name,
  };

  let foundUser = (
    await db.update(Users).set(updateObject).where(eq(Users.googleId, updateObject.googleId)).returning()
  )[0];

  if (!foundUser) {
    foundUser = (
      await db
        .insert(Users)
        .values({
          ...updateObject,
        })
        .returning()
    )[0];

    if (!foundUser) {
      throw new AppError(GenericErrors.UNEXPECTED_ERROR, {
        message: 'Error creating user',
        profile,
      });
    }
  }

  return foundUser;
};

export { getOrCreateUserWithGoogle };

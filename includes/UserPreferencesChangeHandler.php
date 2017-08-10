<?php
/*
 * This file is part of the MediaWiki extension Popups.
 *
 * Popups is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * Popups is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Popups.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @file
 * @ingroup extensions
 */
namespace Popups;

use MediaWiki\MediaWikiServices;
use User;
use PreferencesForm;

/**
 * User Preferences save change listener
 *
 * @package Popups
 */
class UserPreferencesChangeHandler {
	/**
	 * @var PopupsContext
	 */
	private $popupsContext;

	/**
	 * UserPreferencesChangeHandler constructor.
	 * @param PopupsContext $context Popups context instance
	 */
	public function __construct( $context ) {
		$this->popupsContext = $context;
	}

	/**
	 * Hook executed on Preferences Form Save, when user disables Page Previews call PopupsContext
	 * to log `disabled` event.
	 *
	 * @param User $user Logged-in user
	 * @param array $oldUserOptions Old user options array
	 */
	public function doPreferencesFormPreSave( User $user, array $oldUserOptions ) {
		if ( !array_key_exists( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME, $oldUserOptions ) ) {
			return;
		}
		$oldSetting = $oldUserOptions[ PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME ];
		$newSetting = $user->getOption( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME );

		if ( $oldSetting == PopupsContext::PREVIEWS_ENABLED
			&& $newSetting == PopupsContext::PREVIEWS_DISABLED ) {
			$this->popupsContext->logUserDisabledPagePreviewsEvent();
		}
	}

	/**
	 * @return UserPreferencesChangeHandler
	 */
	private static function newFromGlobalState() {
		return MediaWikiServices::getInstance()->getService( 'Popups.UserPreferencesChangeHandler' );
	}

	/**
	 * @param array $formData Form data submitted by user
	 * @param PreferencesForm $form A preferences form
	 * @param User $user Logged-in user
	 * @param bool &$result Variable defining is form save successful
	 * @param array $oldUserOptions Old user options array
	 */
	public static function onPreferencesFormPreSave(
		array $formData,
		PreferencesForm $form,
		User $user,
		&$result,
		$oldUserOptions ) {
		self::newFromGlobalState()->doPreferencesFormPreSave( $user, $oldUserOptions );
	}
}

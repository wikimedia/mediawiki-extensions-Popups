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

use MediaWiki\User\UserOptionsLookup;
use Popups\PopupsContext;
use Popups\UserPreferencesChangeHandler;

/**
 * @group Popups
 * @coversDefaultClass \Popups\UserPreferencesChangeHandler
 */
class UserPreferencesChangeHandlerTest extends MediaWikiUnitTestCase {

	/**
	 * @covers ::doPreferencesFormPreSave
	 * @covers ::__construct
	 * @dataProvider provideDataForEventHandling
	 */
	public function testEventHandling( $oldOption, $newOption, $expectedMethodCallsCount ) {
		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $expectedMethodCallsCount )
			->method( 'logUserDisabledPagePreviewsEvent' );

		/** @var User $userMock */
		$userMock = $this->createMock( User::class );

		$userOptionsLookupMock = $this->createMock( UserOptionsLookup::class );
		$userOptionsLookupMock
			->method( 'getBoolOption' )
			->willReturn( $newOption );

		$oldOptions = [
			PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME => $oldOption
		];
		$listener = new UserPreferencesChangeHandler(
			$contextMock,
			$userOptionsLookupMock
		);
		$listener->doPreferencesFormPreSave( $userMock, $oldOptions );
	}

	public function provideDataForEventHandling() {
		return [
			[ PopupsContext::PREVIEWS_DISABLED, PopupsContext::PREVIEWS_DISABLED, $this->never() ],
			[ PopupsContext::PREVIEWS_ENABLED, PopupsContext::PREVIEWS_ENABLED, $this->never() ],
			[ PopupsContext::PREVIEWS_DISABLED, PopupsContext::PREVIEWS_ENABLED, $this->never() ],
			[ PopupsContext::PREVIEWS_ENABLED, PopupsContext::PREVIEWS_DISABLED, $this->once() ]
		];
	}

}

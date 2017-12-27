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
use Popups\PopupsContext;
use Popups\UserPreferencesChangeHandler;

/**
 * Integration tests for Page Preview hooks
 *
 * @group Popups
 * @coversDefaultClass \Popups\UserPreferencesChangeHandler
 */
class UserPreferencesChangeHandlerTest extends MediaWikiTestCase {

	/**
	 * @covers ::doPreferencesFormPreSave
	 * @covers ::__construct
	 * @dataProvider provideDataForEventHandling
	 */
	public function testEventHandling( $oldOption, $newOption, $expectedMethodCallsCount ) {
		$contextMock = $this->getMockBuilder( PopupsContexts::class )
			->disableOriginalConstructor()
			->setMethods( [ 'logUserDisabledPagePreviewsEvent' ] )
			->getMock();

		$contextMock->expects( $expectedMethodCallsCount )
			->method( 'logUserDisabledPagePreviewsEvent' );

		$user = $this->getMutableTestUser()->getUser();
		$user->setOption( PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME, $newOption );
		$oldOptions = [
			PopupsContext::PREVIEWS_OPTIN_PREFERENCE_NAME => $oldOption
		];
		$listener = new UserPreferencesChangeHandler( $contextMock );
		$listener->doPreferencesFormPreSave( $user, $oldOptions );
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

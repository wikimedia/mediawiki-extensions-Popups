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

use MediaWiki\Config\HashConfig;
use MediaWiki\Config\MultiConfig;
use MediaWiki\Output\OutputPage;
use MediaWiki\User\User;
use Popups\PopupsContext;
use Popups\PopupsHooks;
use Psr\Log\LoggerInterface;

/**
 * Integration tests for popups hooks
 *
 * @group Popups
 * @coversDefaultClass \Popups\PopupsHooks
 */
class PopupsHooksTest extends MediaWikiIntegrationTestCase {

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesPreviewsDisabled() {
		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->willReturn( false );

		$prefs = [ 'someNotEmptyValue' => 'notEmpty' ];

		( new PopupsHooks(
			new HashConfig(),
			$contextMock,
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
			->onGetPreferences( $this->createMock( User::class ), $prefs );
		$this->assertCount( 1, $prefs, 'No preferences are retrieved.' );
		$this->assertSame( 'notEmpty',
			$prefs[ 'someNotEmptyValue'],
			'No preferences are changed.' );
	}

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesNavPopupGadgetIsOn() {
		$userMock = $this->createMock( User::class );

		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->willReturn( true );
		$contextMock->expects( $this->once() )
			->method( 'conflictsWithNavPopupsGadget' )
			->with( $userMock )
			->willReturn( true );

		$prefs = [];

		( new PopupsHooks(
			new HashConfig(),
			$contextMock,
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
			->onGetPreferences( $userMock, $prefs );
		$this->assertArrayHasKey( 'popups',
			$prefs,
			'The opt-in preference is retrieved.' );
		$this->assertArrayHasKey( 'disabled',
			$prefs[ 'popups' ],
			'The opt-in preference has a status.' );
		$this->assertTrue(
			$prefs[ 'popups']['disabled'],
			'The opt-in preference\'s status is disabled.' );
		$this->assertNotEmpty( $prefs[ 'popups']['help-message'],
			'The opt-in preference has a help message.' );
	}

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesPreviewsEnabled() {
		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->willReturn( true );
		$contextMock->expects( $this->once() )
			->method( 'conflictsWithNavPopupsGadget' )
			->willReturn( false );

		$prefs = [
			'skin' => 'skin stuff',
			'someNotEmptyValue' => 'notEmpty',
			'other' => 'notEmpty'
		];

		( new PopupsHooks(
			new HashConfig(),
			$contextMock,
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
			->onGetPreferences( $this->createMock( User::class ), $prefs );
		$this->assertGreaterThan( 3, count( $prefs ), 'A preference is retrieved.' );
		$this->assertSame( 'notEmpty',
			$prefs[ 'someNotEmptyValue'],
			'Unretrieved preferences are unchanged.' );
		$this->assertArrayHasKey( 'popups',
			$prefs,
			'The opt-in preference is retrieved.' );
		$this->assertSame( 1,
			array_search( 'popups',
				array_keys( $prefs ) ),
			'The opt-in preference is injected after Skin select.' );
	}

	/**
	 * @covers ::onGetPreferences
	 */
	public function testOnGetPreferencesPreviewsEnabledWhenSkinIsNotAvailable() {
		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'showPreviewsOptInOnPreferencesPage' )
			->willReturn( true );
		$contextMock->expects( $this->once() )
			->method( 'conflictsWithNavPopupsGadget' )
			->willReturn( false );

		$prefs = [
			'someNotEmptyValue' => 'notEmpty',
			'other' => 'notEmpty'
		];

		( new PopupsHooks(
			new HashConfig(),
			$contextMock,
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
			->onGetPreferences( $this->createMock( User::class ), $prefs );
		$this->assertGreaterThan( 2, count( $prefs ), 'A preference is retrieved.' );
		$this->assertArrayHasKey( 'popups',
			$prefs,
			'The opt-in preference is retrieved.' );
		$this->assertSame( 2,
			array_search( 'popups',
				array_keys( $prefs ) ),
			'The opt-in preference is appended.' );
	}

	/**
	 * @covers ::onResourceLoaderGetConfigVars
	 */
	public function testOnResourceLoaderGetConfigVars() {
		$vars = [ 'something' => 'notEmpty' ];
		$config = [
			'PopupsRestGatewayEndpoint' => '/api',
			'PopupsVirtualPageViews' => true,
			'PopupsGateway' => 'mwApiPlain',
			'PopupsStatsvSamplingRate' => 0,
			'PopupsTextExtractsIntroOnly' => true,
		];
		( new PopupsHooks(
			new HashConfig( $config ),
			$this->getServiceContainer()->getService( 'Popups.Context' ),
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
			->onResourceLoaderGetConfigVars( $vars, '', new MultiConfig( $config ) );
		$this->assertCount( 6, $vars, 'A configuration is retrieved.' );

		foreach ( $config as $key => $value ) {
			$this->assertSame(
				$value,
				$vars[ "wg$key" ],
				"It forwards the \"wg{$key}\" config variable to the client."
			);
		}
	}

	/**
	 * @covers ::onBeforePageDisplay
	 */
	public function testOnBeforePageDisplayWhenDependenciesAreNotMet() {
		$skinMock = $this->createMock( Skin::class );
		$outPageMock = $this->createMock( OutputPage::class );
		$outPageMock->expects( $this->never() )
			->method( 'addModules' );
		$loggerMock = $this->createMock( LoggerInterface::class );
		$loggerMock->expects( $this->once() )
			->method( 'error' );

		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->expects( $this->once() )
			->method( 'areDependenciesMet' )
			->willReturn( false );
		$contextMock->expects( $this->once() )
			->method( 'isTitleExcluded' )
			->willReturn( false );

		( new PopupsHooks(
			new HashConfig(),
			$contextMock,
			$loggerMock,
			$this->getServiceContainer()->getUserOptionsManager()
		) )
			->onBeforePageDisplay( $outPageMock, $skinMock );
	}

	public static function providerOnBeforePageDisplay() {
		return [
			[ true, false ],
			[ true, false ],
			// Code not sent if title is excluded
			[ false, true ],
			// Code not sent if title is excluded
			[ false, true ]
		];
	}

	/**
	 * @covers ::onBeforePageDisplay
	 * @dataProvider providerOnBeforePageDisplay
	 */
	public function testOnBeforePageDisplay(
			$isCodeLoaded, $isTitleExcluded ) {
		$skinMock = $this->createMock( Skin::class );

		$user = $this->getServiceContainer()->getUserFactory()->newAnonymous();
		$outPageMock = $this->createMock( OutputPage::class );
		$outPageMock->expects( $isCodeLoaded ? $this->once() : $this->never() )
			->method( 'addModules' )
			->with( [ 'ext.popups' ] );
		$outPageMock->method( 'getUser' )
			->willReturn( $user );

		$contextMock = $this->createMock( PopupsContext::class );

		if ( !$isTitleExcluded ) {
			$contextMock->expects( $this->once() )
				->method( 'areDependenciesMet' )
				->willReturn( true );
		}

		$contextMock->expects( $this->once() )
			->method( 'isTitleExcluded' )
			->willReturn( $isTitleExcluded );

		( new PopupsHooks(
			new HashConfig(),
			$contextMock,
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
			->onBeforePageDisplay( $outPageMock, $skinMock );
	}

	/**
	 * @covers ::onMakeGlobalVariablesScript
	 */
	public function testOnMakeGlobalVariablesScript() {
		$user = $this->getServiceContainer()->getUserFactory()->newAnonymous();

		$outputPage = $this->createMock( OutputPage::class );
		$outputPage->method( 'getUser' )
			->willReturn( $user );

		$contextMock = $this->createMock( PopupsContext::class );
		$contextMock->method( 'getConfigBitmaskFromUser' )
			->with( $user )
			->willReturn( 0 );

		$vars = [];
		( new PopupsHooks(
			new HashConfig(),
			$contextMock,
			$this->getServiceContainer()->getService( 'Popups.Logger' ),
			$this->getServiceContainer()->getUserOptionsManager()
		) )
			->onMakeGlobalVariablesScript( $vars, $outputPage );

		$this->assertCount( 1, $vars, 'Number of added variables.' );
		$this->assertSame( 0, $vars[ 'wgPopupsFlags' ],
			'The wgPopupsFlags global is present and 0.' );
	}

}

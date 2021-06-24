const { BN, ether, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const ERC20 = artifacts.require('ERC20Token');

contract('ERC20Token', function (accounts) {
  const _name = 'ALYRA';
  const _symbol = 'ALY';
  const _initialsupply = new BN(1000);
  const _decimals = new BN(18);
  const owner = accounts[0];
  const recipient = accounts[1];

  beforeEach(async function () {
    this.ERC20Instance = await ERC20.new(_initialsupply,{from: owner});
  });

  it('a un nom', async function () {
    expect(await this.ERC20Instance.name()).to.equal(_name);
  });

  it('a un symbole', async function () {
    expect(await this.ERC20Instance.symbol()).to.equal(_symbol);
  });

  it('a une valeur décimal', async function () {
    expect(await this.ERC20Instance.decimals()).to.be.bignumber.equal(_decimals);
  });

  it('vérifie la balance du propriétaire du contrat', async function (){
    let balanceOwner = await this.ERC20Instance.balanceOf(owner);
    let totalSupply = await this.ERC20Instance.totalSupply();
    expect(balanceOwner).to.be.bignumber.equal(totalSupply);
  });

  it('vérifie si un transfer est bien effectué', async function (){
    let balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
    let balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
    let amount = new BN(10);

    await this.ERC20Instance.transfer(recipient, amount, {from: owner});
    let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
    let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);

    expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
    expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
  });

  describe('approve', () => {
    const amount = new BN(10);

    beforeEach(async function () {  
      this.allowanceAmountBeforeApprove = await this.ERC20Instance.allowance(owner, recipient);
      this.approveResult = await this.ERC20Instance.approve(recipient, amount, { from: owner });
    });

    it('augmente le montant autorisé', async function () {
      let amount = new BN(10);
  
      await this.ERC20Instance.approve(recipient, amount, {from: owner});
      let allowanceAmountAfter = await this.ERC20Instance.allowance(owner, recipient);
  
      expect(allowanceAmountAfter).to.be.bignumber.equal(this.allowanceAmountBeforeApprove.add(amount));
    });

    it('l\'événement "Approval" est emit', async function () {
      expectEvent(this.approveResult, 'Approval', {
        owner,
        spender: recipient,
        value: amount,
      });
    });
  });

  describe('transferFrom', () => {
    const allowanceAmount = new BN(10);
    const transferAmount = new BN(7);
    
    beforeEach(async function () {
      await this.ERC20Instance.approve(recipient, allowanceAmount, {from: owner});

      this.balanceOwnerBeforeTransfer = await this.ERC20Instance.balanceOf(owner);
      this.balanceRecipientBeforeTransfer = await this.ERC20Instance.balanceOf(recipient);
      this.allowanceAmountBeforeTransfer = await this.ERC20Instance.allowance(owner, recipient);

      this.transferFromResult = await this.ERC20Instance.transferFrom(owner, recipient, transferAmount, {from: recipient});
    });

    it('met à jour les balances', async function () {
      let balanceOwnerAfterTransfer = await this.ERC20Instance.balanceOf(owner);
      let balanceRecipientAfterTransfer = await this.ERC20Instance.balanceOf(recipient);

      expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(this.balanceOwnerBeforeTransfer.sub(transferAmount));
      expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(this.balanceRecipientBeforeTransfer.add(transferAmount));
    });

    it('met à jour le montant autorisé', async function () {
      let allowanceAmountAfterTransfer = await this.ERC20Instance.allowance(owner, recipient);
  
      expect(allowanceAmountAfterTransfer).to.be.bignumber.equal(this.allowanceAmountBeforeTransfer.sub(transferAmount));
    });

    it('l\'événement "Approval" est emit', async function () {
      expectEvent(this.transferFromResult, 'Approval', {
        owner,
        spender: recipient,
        value: this.allowanceAmountBeforeTransfer.sub(transferAmount),
      });
    });

    it('l\'événement "Transfer" est emit', async function () {
      expectEvent(this.transferFromResult, 'Transfer', {
        from: owner,
        to: recipient,
        value: transferAmount,
      });
    });
  });
});
